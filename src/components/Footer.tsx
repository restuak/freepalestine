export default function Footer() {
  return (
    <footer className="bg-black/80 text-center text-xs py-4 border-t border-white/10 font-sans">
      <p>
        All Data from{" "}
        <a
          href="https://data.techforpalestine.org/docs/datasets/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E0404E] hover:underline"
        >
          Tech for Palestine
        </a>{" "}
        - ©{new Date().getFullYear()}
      </p>
    </footer>
  );
}
