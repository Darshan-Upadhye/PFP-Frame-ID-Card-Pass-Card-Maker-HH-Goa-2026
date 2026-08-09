export default function Footer() {
  return (
    <footer className="mt-8 pt-5 border-t border-hh-green-line/60 text-center space-y-1.5">
      <p className="text-[11px] text-hh-cream/40 font-mono leading-relaxed">
        PFP Frame, ID Card & Pass Card Maker by{' '}
        <a
          href="https://x.com/DarshanUpadhye7"
          target="_blank"
          rel="noopener noreferrer"
          className="text-hh-yellow/80 hover:text-hh-yellow underline underline-offset-2"
        >
          Team RakshakTech
        </a>
        .
      </p>
      <p className="text-[11px] text-hh-cream/30 font-mono">
        <a
          href="https://hhgoa.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-hh-cream/50 hover:text-hh-yellow underline underline-offset-2"
        >
          hhgoa.com
        </a>
        {' '}&middot;{' '}
        <a
          href="https://hacker-house-goa-2026.devfolio.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-hh-cream/50 hover:text-hh-yellow underline underline-offset-2"
        >
          Devfolio
        </a>
        {' '}&middot; #FrameInGoa
      </p>
    </footer>
  )
}