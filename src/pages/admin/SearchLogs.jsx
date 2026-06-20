import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../lib/supabaseClient";
import SEO from "../../components/seo/SEO";

export default function SearchLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("search_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error(error);
      alert("Could not load search logs.");
    } else {
      setLogs(data || []);
    }

    setLoading(false);
  }

  const searchSummary = useMemo(() => {
    const counts = {};

    logs.forEach((log) => {
      const key = log.query.trim().toLowerCase();

      if (!counts[key]) {
        counts[key] = {
          query: log.query.trim(),
          count: 0,
          zeroResults: 0,
        };
      }

      counts[key].count += 1;

      if (log.results_count === 0) {
        counts[key].zeroResults += 1;
      }
    });

    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [logs]);

  const noResultSearches = searchSummary.filter((item) => item.zeroResults > 0);

  return (
    <AdminLayout>
      <SEO title="Search Logs" noindex />

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-black text-[#171717]">
          Search Logs
        </h1>

        <p className="text-sm text-gray-500">
          See what people are searching for on the website.
        </p>
      </div>

      {loading ? (
        <p>Loading search logs...</p>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black text-[#171717]">
              Most searched terms
            </h2>

            {searchSummary.length === 0 ? (
              <p className="text-gray-500">No searches logged yet.</p>
            ) : (
              <div className="space-y-3">
                {searchSummary.slice(0, 30).map((item) => (
                  <div
                    key={item.query}
                    className="flex items-center justify-between rounded-xl bg-[#faf8ff] p-4"
                  >
                    <div>
                      <p className="font-bold text-[#171717]">{item.query}</p>
                      {item.zeroResults > 0 && (
                        <p className="text-sm text-red-600">
                          {item.zeroResults} with no results
                        </p>
                      )}
                    </div>

                    <span className="rounded-full bg-[#5e17eb] px-3 py-1 text-sm font-bold text-white">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-black text-[#171717]">
              Searches with no results
            </h2>

            {noResultSearches.length === 0 ? (
              <p className="text-gray-500">No zero-result searches yet.</p>
            ) : (
              <div className="space-y-3">
                {noResultSearches.slice(0, 30).map((item) => (
                  <div
                    key={item.query}
                    className="flex items-center justify-between rounded-xl bg-red-50 p-4"
                  >
                    <p className="font-bold text-[#171717]">{item.query}</p>

                    <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
                      {item.zeroResults}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm lg:col-span-2">
            <h2 className="mb-5 text-xl font-black text-[#171717]">
              Recent searches
            </h2>

            {logs.length === 0 ? (
              <p className="text-gray-500">No recent searches.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="py-3">Search</th>
                      <th className="py-3">Results</th>
                      <th className="py-3">Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="py-3 font-bold text-[#171717]">
                          {log.query}
                        </td>

                        <td className="py-3">
                          {log.results_count === 0 ? (
                            <span className="font-bold text-red-600">
                              0 results
                            </span>
                          ) : (
                            `${log.results_count} results`
                          )}
                        </td>

                        <td className="py-3 text-gray-500">
                          {new Date(log.created_at).toLocaleString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </AdminLayout>
  );
}