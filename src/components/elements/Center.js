export default async function Center({ children }) {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center px-4">
        {children}
      </div>
    </>
  );
}
