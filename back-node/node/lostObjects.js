import path from "path";
import { fileURLToPath } from "url";
import {sequelize} from "./models/index.js";

import lostObjectRoutes from "./routes/lostObjectRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.NODE_LOST_OBJECT_PORT || 3005;

app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use("/api/lost-objects", lostObjectRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
).catch((error) => {
    console.error("Unable to connect to the database:", error);
});