use std::fs;
use std::io::ErrorKind;
use std::path::PathBuf;
use std::process::{Child, Command, Stdio};
use std::sync::Mutex;

use serde::{Deserialize, Serialize};
use tauri::webview::WebviewWindowBuilder;
use tauri::Manager;
use tauri::{AppHandle, State, WebviewUrl};
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

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Default)]
#[serde(rename_all = "lowercase")]
pub enum AppMode {
    #[default]
    Unset,
    Local,
    Remote,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct DesktopConfig {
    /// Schema version; bump on breaking on-disk format changes.
    pub version: u32,
    #[serde(default)]
    pub mode: AppMode,
    pub remote_base_url: Option<String>,
    pub local_display_name: Option<String>,
}

impl Default for DesktopConfig {
    fn default() -> Self {
        Self {
            version: 1,
            mode: AppMode::default(),
            remote_base_url: None,
            local_display_name: None,
        }
    }
}

fn app_config_path(app: &AppHandle) -> Result<PathBuf, String> {
    let mut dir = app
        .path()
        .app_local_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?;
    std::fs::create_dir_all(&dir).map_err(|e| format!("Failed to create app data dir: {e}"))?;
    dir.push("trackr-config.json");
    Ok(dir)
}

fn read_config(app: &AppHandle) -> Result<DesktopConfig, String> {
    let p = app_config_path(app)?;
    let raw = match fs::read_to_string(&p) {
        Ok(s) => s,
        Err(e) if e.kind() == ErrorKind::NotFound => {
            return Ok(DesktopConfig::default());
        }
        Err(e) => return Err(format!("Failed to read config: {e}")),
    };
    serde_json::from_str(&raw).map_err(|e| format!("Invalid config file: {e}"))
}

fn write_config_file(app: &AppHandle, c: &DesktopConfig) -> Result<(), String> {
    let p = app_config_path(app)?;
    let tmp = p.with_extension("json.tmp");
    let s = serde_json::to_string_pretty(c).map_err(|e| e.to_string())?;
    fs::write(&tmp, s).map_err(|e| format!("Failed to write config: {e}"))?;
    fs::rename(&tmp, &p).map_err(|e| format!("Failed to save config: {e}"))
}

const ADJ: [&str; 170] = [
    "brisk", "quiet", "swift", "gentle", "bold", "calm", "bright", "dappled", "eager", "frosted",
    "golden", "hollow", "jade", "kind", "lunar", "mellow", "nimble", "olive", "proud", "rapid",
    "sparkling", "tranquil", "vibrant", "whimsical", "zenith", "zephyr", "aether", "blossom", "cascade", "dusk",
    "echo", "fable", "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic", "nebulous",
    "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper", "xanadu",
    "yonder", "zenith", "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable", "glisten",
    "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl", "quasar",
    "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith", "zephyr",
    "aether", "blossom", "cascade", "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade",
    "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil",
    "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade",
    "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic",
    "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper",
    "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable",
    "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl",
    "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith",
    "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable", "glisten", "horizon", "iris",
];
const NOUN: [&str; 354] = [
    "mesa", "river", "canyon", "pines", "harbor", "maple", "coral", "dune", "falcon", "grove",
    "heath", "isle", "jetty", "kite", "lattice", "meadow", "oak", "prairie", "raven", "summit",
    "valley", "wave", "whale", "xylophone", "yacht", "zebra", "zephyr", "aether", "blossom", "cascade",
    "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic",
    "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper",
    "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable",
    "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl",
    "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith",
    "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade",
    "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil",
    "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade",
    "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic",
    "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper",
    "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable",
    "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl",
    "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith",
    "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade",
    "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil",
    "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade",
    "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic",
    "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper",
    "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable",
    "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl",
    "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith",
    "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade",
    "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil",
    "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade",
    "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic",
    "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper",
    "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable",
    "glisten", "horizon", "iris", "jade", "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl",
    "quasar", "radiant", "sylph", "tranquil", "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith",
    "zephyr", "aether", "blossom", "cascade", "dusk", "echo", "fable", "glisten", "horizon", "iris", "jade",
    "kaleidoscope", "luster", "mystic", "nebulous", "oasis", "pearl", "quasar", "radiant", "sylph", "tranquil",
    "ultraviolet", "valkyrie", "whisper", "xanadu", "yonder", "zenith", "zephyr", "aether", "blossom", "cascade",
];

#[tauri::command]
fn generate_local_display_name() -> String {
    use rand::Rng;
    let mut rng = rand::thread_rng();
    let a = rng.gen_range(0..ADJ.len());
    let n = rng.gen_range(0..NOUN.len());
    format!("local-{}-{}", ADJ[a], NOUN[n])
}

/// Normalize server URL: trim, strip trailing `/`, require http(s) when present.
fn normalize_remote_url(raw: &str) -> Result<String, String> {
    let s = raw.trim().trim_end_matches('/').to_string();
    if s.is_empty() {
        return Err(String::from("URL is required"));
    }
    let u = tauri::Url::parse(&s).map_err(|e| e.to_string())?;
    if u.scheme() != "http" && u.scheme() != "https" {
        return Err(String::from("URL must be http or https"));
    }
    Ok(s)
}

fn stop_sidecar(state: &State<SidecarState>) {
    if let Ok(mut c) = state.child.lock() {
        if let Some(ref mut ch) = *c {
            let _ = ch.kill();
        }
        *c = None;
    }
    if let Ok(mut u) = state.base_url.lock() {
        *u = None;
    }
}

#[tauri::command]
fn get_desktop_config(app: AppHandle) -> Result<DesktopConfig, String> {
    read_config(&app)
}

#[tauri::command]
fn set_desktop_config(
    app: AppHandle,
    state: State<SidecarState>,
    config: DesktopConfig,
) -> Result<(), String> {
    let mut c = config;
    if c.version < 1 {
        c.version = 1;
    }
    if c.mode == AppMode::Remote {
        c.remote_base_url = Some(normalize_remote_url(
            c.remote_base_url
                .as_deref()
                .ok_or_else(|| "remoteBaseUrl is required in remote mode".to_string())?,
        )?);
    }
    if c.mode == AppMode::Local && c.local_display_name.is_none() {
        c.local_display_name = Some(generate_local_display_name());
    }
    let was_local = {
        read_config(&app)
            .map(|x| x.mode == AppMode::Local)
            .unwrap_or(false)
    };
    if c.mode == AppMode::Remote && was_local {
        stop_sidecar(&state);
    }
    write_config_file(&app, &c)
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

#[tauri::command]
fn start_local_api(app: AppHandle, state: State<SidecarState>) -> Result<String, String> {
    let conf = read_config(&app)?;
    if conf.mode == AppMode::Remote {
        return conf
            .remote_base_url
            .clone()
            .ok_or_else(|| "Not in local mode".to_string());
    }
    if conf.mode == AppMode::Unset {
        return Err("Choose local or remote mode in settings first".to_string());
    }
    if let Some(url) = state.base_url.lock().map_err(|e| e.to_string())?.clone() {
        return Ok(url);
    }
    start_sidecar(&app, &state)
}

fn start_sidecar(app: &AppHandle, state: &State<SidecarState>) -> Result<String, String> {
    let db_path = resolve_db_path(app)?;
    *state.db_path.lock().map_err(|e| e.to_string())? = Some(db_path.clone());

    let sidecar_path = sidecar_entry_path(app)?;
    let port = 4310;
    let base_url = format!("http://127.0.0.1:{port}");
    let mut cmd = Command::new("node");
    cmd.arg(sidecar_path)
        .env("PORT", String::from("4310"))
        .env("SQLITE_DATABASE_URL", format!("file:{}", db_path.display()))
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
async fn open_remote_login_window(app: AppHandle, base_url: String) -> Result<(), String> {
    let b = normalize_remote_url(&base_url)?;
    if let Some(w) = app.get_webview_window("remote_auth") {
        let _ = w.close();
    }
    let login = tauri::Url::parse(&format!("{b}/login")).map_err(|e| e.to_string())?;
    let _w = WebviewWindowBuilder::new(
        &app,
        "remote_auth",
        WebviewUrl::External(login),
    )
    .title("Sign in to Trackr")
    .build()
    .map_err(|e| e.to_string())?;
    Ok(())
}

fn file_path_to_path_buf(path: FilePath) -> Result<PathBuf, String> {
    match path {
        FilePath::Path(p) => Ok(p),
        FilePath::Url(u) => Err(format!(
            "Unsupported file URL from picker; expected local file path: {u}"
        )),
    }
}

fn require_local_mode_for_sidecar(config: &DesktopConfig) -> Result<(), String> {
    if config.mode == AppMode::Local {
        return Ok(());
    }
    if config.mode == AppMode::Unset {
        return Err("Choose local or remote before export/import".to_string());
    }
    Err("Export and import are only available in local mode with the embedded SQLite copy".to_string())
}

#[tauri::command]
async fn export_local_data(app: AppHandle, state: State<'_, SidecarState>) -> Result<String, String> {
    let c = read_config(&app)?;
    require_local_mode_for_sidecar(&c)?;
    let base_url = if let Some(u) = state.base_url.lock().map_err(|e| e.to_string())?.clone() {
        u
    } else {
        start_sidecar(&app, &state)?
    };
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
    let c = read_config(&app)?;
    require_local_mode_for_sidecar(&c)?;
    let base_url = if let Some(u) = state.base_url.lock().map_err(|e| e.to_string())?.clone() {
        u
    } else {
        start_sidecar(&app, &state)?
    };

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
            get_desktop_config,
            set_desktop_config,
            generate_local_display_name,
            open_remote_login_window,
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
