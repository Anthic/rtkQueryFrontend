import { Container } from "@mui/material";
import TodoTable from "./pages/TodoTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <Container maxWidth="lg">
        <TodoTable />
        <ToastContainer />
      </Container>
    </>
  );
}

export default App;
