export default function Footer() {
  return (
    <footer className="bg-black/80 text-center text-xs py-4 border-t border-white/10">
      <p>
        All Data from{" "}
        <a
          href="https://data.techforpalestine.org/docs/datasets/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:underline"
        >
          Tech for Palestine
        </a>{" "}
        - ©{new Date().getFullYear()}
      </p>
    </footer>
  );
}
