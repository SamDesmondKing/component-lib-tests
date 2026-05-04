import { useState } from "react";
import { LoginPage } from "./LoginPage";
import { FieldLedger } from "./FieldLedger";
import { generateMockFields } from "./mockData";
import type { FieldRecord } from "./types";

function App() {
	const [authenticated, setAuthenticated] = useState(false);
	const [fields, setFields] = useState<FieldRecord[]>(() =>
		generateMockFields(1000),
	);

	if (!authenticated) {
		return <LoginPage onLogin={() => setAuthenticated(true)} />;
	}

	return <FieldLedger fields={fields} onFieldsChange={setFields} />;
}

export default App;
