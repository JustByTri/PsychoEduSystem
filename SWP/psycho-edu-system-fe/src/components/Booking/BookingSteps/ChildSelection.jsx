export const ChildSelection = () => {
  const { updateBookingData, bookingData } = useBooking();
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/parents/${bookingData.userId}/children`,
          {
            headers: {
              Authorization: `Bearer ${
                getAuthDataFromLocalStorage().accessToken
              }`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch children");
        }

        const data = await response.json();
        setChildren(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [bookingData.userId]);

  if (isLoading) return <div>Loading children data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-4">Select Child</h2>
      <div className="space-y-3">
        {children.map((child) => (
          <div
            key={child.id}
            onClick={() =>
              updateBookingData({
                childId: child.id,
                childName: child.name,
                studentId: child.id, // For homeroom teacher lookup
              })
            }
            className={`p-4 border rounded-md cursor-pointer transition-colors
              ${
                bookingData.childId === child.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {child.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="font-medium">{child.name}</p>
                <p className="text-sm text-gray-500">Grade {child.grade}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
