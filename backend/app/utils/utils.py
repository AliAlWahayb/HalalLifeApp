import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional


def get_utc_now() -> datetime:
    """Get the current UTC time."""
    return datetime.now(timezone.utc)


def setup_logger(name: str, log_level: str = "INFO") -> logging.Logger:
    """
    Set up a logger with the given name and log level.
    """
    logger = logging.getLogger(name)

    log_level_map = {
        "DEBUG": logging.DEBUG,
        "INFO": logging.INFO,
        "WARNING": logging.WARNING,
        "ERROR": logging.ERROR,
        "CRITICAL": logging.CRITICAL
    }

    level = log_level_map.get(log_level.upper(), logging.INFO)
    logger.setLevel(level)

    # Create console handler and set level
    ch = logging.StreamHandler()
    ch.setLevel(level)

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    # Add formatter to ch
    ch.setFormatter(formatter)

    # Add ch to logger
    logger.addHandler(ch)

    return logger
