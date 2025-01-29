const Loading = () => {
  return (
    <div
      aria-label="Loading..."
      role="status"
      className="flex justify-center items-center w-full"
    >
      <span className="text-4xl font-medium text-gray-500">Loading...</span>
    </div>
  );
};

export default Loading;
