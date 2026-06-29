import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../src/layouts/MainLayouts";

import Home from "../src/pages/Home";
import Events from "../src/pages/Events";
import News from "../src/pages/News";
import ActionPlan from "../src/pages/ActionPlan";
import Volunteer from "../src/pages/Volunteer";
import Contact from "../src/pages/Contact";
import Gallery from "./pages/Gallery";
import UsefulInformation from "./pages/UsefulInformation";
import NewsArticle from "./pages/NewsArticle";
import PhotoCredits from "./pages/PhotoCredits";
import SubmitEvent from "./pages/SubmitEvent";
import EventArticle from "./pages/EventArticle";
import NotFound from "./pages/NotFound";
import Search from "./pages/Search";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import EditSubmittedEvent from "./pages/EditSubmittedEvent";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import AdminLocalEvents from "./pages/admin/LocalEvents";
import AdminNews from "./pages/admin/News";
import AdminActionPlan from "./pages/admin/ActionPlan";
import AdminGallery from "./pages/admin/Gallery";
import PreviousEvents from "./pages/PreviousEvents";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import AdminUsers from "./pages/admin/Users";
import UsefulInfoAdmin from "./pages/admin/UsefulInfoAdmin";
import SearchLogs from "./pages/admin/SearchLogs";

import TestPage from "./pages/TestPage"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC SITE */}
        <Route
          path="/"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />

        <Route
          path="/events"
          element={
            <MainLayout>
              <Events />
            </MainLayout>
          }
        />
        <Route
  path="/events/:slug"
  element={
    <MainLayout>
      <EventArticle />
    </MainLayout>
  }
/>

        <Route
          path="/news"
          element={
            <MainLayout>
              <News />
            </MainLayout>
          }
        />

        <Route
          path="/news/:slug"
          element={
            <MainLayout>
              <NewsArticle />
            </MainLayout>
          }
        />

        <Route
          path="/action-plan"
          element={
            <MainLayout>
              <ActionPlan />
            </MainLayout>
          }
        />

        <Route
          path="/volunteer"
          element={
            <MainLayout>
              <Volunteer />
            </MainLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />

        <Route
          path="/gallery"
          element={
            <MainLayout>
              <Gallery />
            </MainLayout>
          }
        />

        <Route
          path="/useful-information"
          element={
            <MainLayout>
              <UsefulInformation />
            </MainLayout>
          }
        />

        <Route
          path="/photo-credits"
          element={
            <MainLayout>
              <PhotoCredits />
            </MainLayout>
          }
        />

        <Route
          path="/submit-event"
          element={
            <MainLayout>
              <SubmitEvent />
            </MainLayout>
          }
        />
        <Route
  path="/previous-events"
  element={
    <MainLayout>
      <PreviousEvents />
    </MainLayout>
  }
/>
<Route
  path="/search"
  element={
    <MainLayout>
      <Search />
    </MainLayout>
  }
/>
<Route
  path="/privacy-policy"
  element={
    <MainLayout>
      <PrivacyPolicy />
    </MainLayout>
  }
/>

<Route
  path="/cookie-policy"
  element={
    <MainLayout>
      <CookiePolicy />
    </MainLayout>
  }
/>
<Route path="/submit-event/edit/:editToken" element={<MainLayout><EditSubmittedEvent /></MainLayout>} />

<Route path="/TestPage" element={<MainLayout><TestPage /></MainLayout>} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/localevents" element={<AdminLocalEvents />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/actionplan" element={<AdminActionPlan />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/users" element={<AdminUsers />} />
<Route path="/admin/reset-password" element={<ResetPassword />} />
<Route
  path="/admin/useful-info"
  element={<UsefulInfoAdmin />}
/>
<Route path="/admin/search-logs" element={<SearchLogs />} />
<Route
  path="*"
  element={
    <MainLayout>
      <NotFound />
    </MainLayout>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}