export default function UserLayout({
  children,
  auth,
  modal,
}: {
  children: React.ReactNode;
  auth: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {auth}
      {modal}
      {children}
    </>
  );
}
