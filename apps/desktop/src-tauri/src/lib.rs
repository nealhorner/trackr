use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;

use tauri::{AppHandle, Manager, State};
use tauri_plugin_dialog::{DialogExt, FilePath};

struct SidecarState {
    child: Mutex<Option<Child>>,
    base_url: Mutex<Option<String>>,
    db_path: Mutex<Option<PathBuf>>,
}

impl Default for SidecarState {
    fn default() -> Self {
        Self {
            child: Mutex::new(None),
            base_url: Mutex::new(None),
            db_path: Mutex::new(None),
        }
    }
}

fn resolve_db_path(app: &AppHandle) -> Result<PathBuf, String> {
    let mut dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?;
    std::fs::create_dir_all(&dir).map_err(|e| format!("Failed to create app data dir: {e}"))?;
    dir.push("trackr.sqlite");
    Ok(dir)
}

fn sidecar_entry_path(app: &AppHandle) -> Result<PathBuf, String> {
    if cfg!(debug_assertions) {
        let p = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("../../../packages/desktop-local-api/dist/index.js");
        return Ok(p);
    }
    app.path()
        .resolve("sidecar/index.js", tauri::path::BaseDirectory::Resource)
        .map_err(|e| format!("Failed to resolve sidecar entry in bundle: {e}"))
}

fn file_path_to_path_buf(path: FilePath) -> Result<PathBuf, String> {
    match path {
        FilePath::Path(p) => Ok(p),
        FilePath::Url(u) => Err(format!(
            "Unsupported file URL from picker; expected local file path: {u}"
        )),
    }
}

#[tauri::command]
fn start_local_api(app: AppHandle, state: State<SidecarState>) -> Result<String, String> {
    if let Some(url) = state.base_url.lock().map_err(|e| e.to_string())?.clone() {
        return Ok(url);
    }

    let db_path = resolve_db_path(&app)?;
    *state.db_path.lock().map_err(|e| e.to_string())? = Some(db_path.clone());

    let sidecar_path = sidecar_entry_path(&app)?;
    let port = 4310;
    let base_url = format!("http://127.0.0.1:{port}");

    let mut cmd = Command::new("node");
    cmd.arg(sidecar_path)
        .env("PORT", String::from("4310"))
        .env("DATABASE_URL", format!("file:{}", db_path.display()))
        .stdout(Stdio::null())
        .stderr(Stdio::null());

    let child = cmd
        .spawn()
        .map_err(|e| format!("Failed to start local API process: {e}"))?;

    *state.child.lock().map_err(|e| e.to_string())? = Some(child);
    *state.base_url.lock().map_err(|e| e.to_string())? = Some(base_url.clone());
    Ok(base_url)
}

#[tauri::command]
async fn export_local_data(app: AppHandle, state: State<'_, SidecarState>) -> Result<String, String> {
    let base_url = start_local_api(app.clone(), state)?;
    let response = reqwest::get(format!("{base_url}/api/v1/local/export"))
        .await
        .map_err(|e| format!("Export request failed: {e}"))?;
    let json = response
        .text()
        .await
        .map_err(|e| format!("Failed reading export payload: {e}"))?;

    let (tx, rx) = std::sync::mpsc::channel();
    app.dialog()
        .file()
        .set_file_name("trackr-export.json")
        .save_file(move |path| {
            let _ = tx.send(path);
        });
    let Some(path) = rx.recv().map_err(|e| e.to_string())? else {
        return Err(String::from("Export cancelled"));
    };
    let path = file_path_to_path_buf(path)?;

    std::fs::write(&path, json).map_err(|e| format!("Failed writing export file: {e}"))?;
    Ok(path.display().to_string())
}

#[tauri::command]
async fn import_local_data(app: AppHandle, state: State<'_, SidecarState>) -> Result<String, String> {
    let base_url = start_local_api(app.clone(), state)?;

    let (tx, rx) = std::sync::mpsc::channel();
    app.dialog().file().pick_file(move |path| {
        let _ = tx.send(path);
    });
    let Some(path) = rx.recv().map_err(|e| e.to_string())? else {
        return Err(String::from("Import cancelled"));
    };
    let path = file_path_to_path_buf(path)?;

    let payload =
        std::fs::read_to_string(&path).map_err(|e| format!("Failed reading import file: {e}"))?;

    let client = reqwest::Client::new();
    let response = client
        .post(format!("{base_url}/api/v1/local/import"))
        .header("content-type", "application/json")
        .body(payload)
        .send()
        .await
        .map_err(|e| format!("Import request failed: {e}"))?;

    if !response.status().is_success() {
        return Err(format!("Import failed with status {}", response.status()));
    }
    Ok(path.display().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(SidecarState::default())
        .invoke_handler(tauri::generate_handler![
            start_local_api,
            export_local_data,
            import_local_data
        ])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_handle, event| {
            if let tauri::RunEvent::Exit = event {
            }
        });
}
