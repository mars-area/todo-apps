import cors, { type CorsOptions, type CorsOptionsDelegate, type CorsRequest } from "cors";
import config from "../configs/app";

// Extend CorsOptions interface with additional properties
interface CorsNewOption extends CorsOptions {
  credentials: boolean;
  methods: string[];
  optionSuccessStatus: number;
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
}

// Define the CORS options
const corsOptions: CorsNewOption | CorsOptionsDelegate<CorsRequest> = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  optionSuccessStatus: 200,
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Check whitelist in production
    if ((config.whitelist_cors as string[]).indexOf(origin!) !== -1 || !origin) {
      return callback(null, true);
    }
    return callback(new Error(`${origin} - Not allowed by CORS`));
  }
};

// Create the CORS middleware
const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
