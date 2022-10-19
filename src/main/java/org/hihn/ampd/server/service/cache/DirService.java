package org.hihn.ampd.server.service.cache;

import org.hihn.ampd.server.model.AmpdSettings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Handles access to the ampd dir. Usually, ~/.local/share/ampd/.
 */
@Service
public class DirService {

	/**
	 * Name of the dir that holds all covers.
	 */
	private static final String CACHE_DIR_NAME = "covers";

	private static final String DB_NAME = "ampd";

	private static final Logger LOG = LoggerFactory.getLogger(DirService.class);

	private final Path ampdHomeDir;

	private final AmpdSettings ampdSettings;

	public DirService(AmpdSettings ampdSettings) {
		this.ampdSettings = ampdSettings;
		ampdHomeDir = buildHomeDir();
		if (!Files.exists(ampdHomeDir) && !new File(ampdHomeDir.toString()).mkdirs()) {
			LOG.warn("Could not create ampd home-dir: {}. This is not fatal, "
					+ "it just means, we can't save or load covers to the local cache.", ampdHomeDir);
		}
	}

	private Path buildHomeDir() {
		Path path = Paths.get(ampdSettings.getHomeDir());
		Path defaultPath = Paths.get(System.getProperty("user.home"), ".local", "share", "ampd");
		if (ampdSettings.getHomeDir().isBlank()) {
			return defaultPath;
		}
		if (!path.toFile().exists()) {
			LOG.error("home dir does not exist: `{}` - please create it or change the value of `home.dir`", path);
			return defaultPath;
		}
		else {
			return path;
		}
	}

	/**
	 * Returns the path of the ampd cache directory. Creates it, if it doesn't exist.
	 * @return The path of the cache dir.
	 */
	public Path getCacheDir() {
		return Paths.get(ampdHomeDir.toString(), CACHE_DIR_NAME);
	}

	public Path getDbPath() {
		return Paths.get(ampdHomeDir.toString(), DB_NAME);
	}

	public Path getAmpdHomeDir() {
		return ampdHomeDir;
	}

}
