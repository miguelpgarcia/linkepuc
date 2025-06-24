import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Opportunities from "./pages/Opportunities";
import Network from "./pages/Network";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFound from "./pages/NotFound";
import NewOpportunity from "./pages/NewOpportunity";
import OpportunityDetail from "./pages/OpportunityDetail";
import ProfessorOpportunities from "./pages/ProfessorOpportunities";
import ProfessorOpportunityDetail from "./pages/ProfessorOpportunityDetail";
import ProfessorLanding from "./pages/ProfessorLanding";
import ProfessorLogin from "./pages/ProfessorLogin";
import ProfessorRegister from "./pages/ProfessorRegister";
import ProfessorMessages from "./pages/ProfessorMessages";
import ProfessorNotifications from "./pages/ProfessorNotifications";
import ProfessorProfile from "./pages/ProfessorProfile";
import ImportCurriculum from "./pages/ImportCurriculum";
import VerifyEmail from "./pages/VerifyEmail";
import { apiFetch } from "@/apiFetch";
import { mapBackendToFrontendOpportunities } from "./pages/Opportunities";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useStaticData } from "./hooks/use-static-data";
import { API_ENDPOINTS } from "@/config/api";

const queryClient = new QueryClient();

function StaticDataLoader() {
  // Load static data IMMEDIATELY when app starts (before login)
  const { isLoading, isReady } = useStaticData();
  
  useEffect(() => {
    if (isReady) {
      console.log("✅ Static data loaded successfully!");
    }
  }, [isReady]);

  return null;
}

function PrefetchData() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Prefetch opportunities
      queryClient.prefetchQuery({
        queryKey: ["opportunities", 0],
        queryFn: async () => {
          const response = await apiFetch(API_ENDPOINTS.VAGAS.PAGINATED(0, 8));
          return response.json();
        },
        staleTime: 30 * 1000,
      });

      // Prefetch conversations
      queryClient.prefetchQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
          const res = await fetch(API_ENDPOINTS.MENSAGENS.CONVERSAS, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("Failed to fetch conversations");
          return res.json();
        },
        staleTime: 30 * 1000,
      });
    }
  }, [queryClient]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <StaticDataLoader />
      <PrefetchData />
      <BrowserRouter basename="/linkepuc">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requireStudent>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute requireStudent>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute requireStudent>
                <Opportunities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities/:id"
            element={
              <ProtectedRoute requireStudent>
                <OpportunityDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network"
            element={
              <ProtectedRoute requireStudent>
                <Network />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute requireStudent>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute requireStudent>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/import-curriculum"
            element={
              <ProtectedRoute requireStudent>
                <ImportCurriculum />
              </ProtectedRoute>
            }
          />
          <Route path="/professor" element={<ProfessorLanding />} />
          <Route path="/professor/login" element={<ProfessorLogin />} />
          <Route path="/professor/register" element={<ProfessorRegister />} />
          <Route
            path="/professor/opportunities"
            element={
              <ProtectedRoute requireProfessor>
                <ProfessorOpportunities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/opportunities/new"
            element={
              <ProtectedRoute requireProfessor>
                <NewOpportunity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/opportunities/:id"
            element={
              <ProtectedRoute requireProfessor>
                <ProfessorOpportunityDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/messages"
            element={
              <ProtectedRoute requireProfessor>
                <ProfessorMessages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/profile"
            element={
              <ProtectedRoute requireProfessor>
                <ProfessorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/profile/:id"
            element={
              <ProtectedRoute requireProfessor>
                <ProfessorProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/professor/notifications"
            element={
              <ProtectedRoute requireProfessor>
                <ProfessorNotifications />
              </ProtectedRoute>
            }
          />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
