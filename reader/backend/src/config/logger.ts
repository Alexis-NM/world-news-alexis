interface LoggerInterface {
	error(message: string | object): void;
	warn(message: string | object): void;
	info(message: string | object): void;
	debug(message: string | object): void;
}

class SimpleLogger implements LoggerInterface {
	private log(
		output: (msg: string, ...args: unknown[]) => void,
		level: string,
		data: string | object,
	): void {
		const timestamp = new Date().toISOString();

		if (typeof data === "object") {
			output(`[${timestamp}] ${level}:`, JSON.stringify(data, null, 2));
		} else {
			output(`[${timestamp}] ${level}: ${data}`);
		}
	}

	error(message: string | object): void {
		this.log(console.error, "ERROR", message);
	}

	warn(message: string | object): void {
		this.log(console.warn, "WARN", message);
	}

	info(message: string | object): void {
		if (process.env.NODE_ENV !== "production") {
			this.log(console.log, "INFO", message);
		}
	}

	debug(message: string | object): void {
		if (process.env.NODE_ENV === "development") {
			this.log(console.log, "DEBUG", message);
		}
	}
}

export const logger = new SimpleLogger();
