import AuthWrapper from "./AuthWrapper";
import AdminNavbar from "./AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-100">
        <AdminNavbar />
        <main className="max-w-7xl mx-auto p-6">
          {children}
        </main>
      </div>
    </AuthWrapper>
  );
}
