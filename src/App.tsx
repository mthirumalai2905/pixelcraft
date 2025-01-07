import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Home } from "./app/home";
import { Edit } from "./app/edit";
import { Nav } from "./components/ui/global/nav";
const App = () => (
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

const AppContent = () => {
  return (
    <main className="font-poppins flex min-h-screen w-full flex-1 flex-col items-start justify-start text-muted-foreground">
      <Nav />
      <Suspense fallback={<Loader2 className="animate-spin" />}>
        <AppRouter />
      </Suspense>
    </main>
  );
};

const AppRouter = () => (
  <Routes>
    <Route index element={<Home />} />
    <Route path="/edit" element={<Edit />} />
  </Routes>
);

export default App;
