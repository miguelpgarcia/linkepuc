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
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ProfessorMessages from "./pages/ProfessorMessages";
import ProfessorNotifications from "./pages/ProfessorNotifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute>
                <Opportunities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities/:id"
            element={
              <ProtectedRoute>
                <OpportunityDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network"
            element={
              <ProtectedRoute>
                <Network />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route path="/professor" element={<ProfessorLanding />} />
          <Route path="/professor/login" element={<ProfessorLogin />} />
          <Route path="/professor/register" element={<ProfessorRegister />} />
          <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
          <Route path="/professor/opportunities" element={<ProfessorOpportunities />} />
          <Route path="/professor/opportunities/new" element={<NewOpportunity />} />
          <Route path="/professor/opportunities/:id" element={<ProfessorOpportunityDetail />} />
          <Route path="/professor/messages" element={<ProfessorMessages />} />
          <Route path="/professor/notifications" element={<ProfessorNotifications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
