export default function Footer() {
  return (
    <footer className="backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <p className="text-sm text-slate-400 text-center">
          &copy; {new Date().getFullYear()} SoundOwl. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
