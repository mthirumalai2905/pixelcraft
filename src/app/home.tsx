import { Edit } from "./edit";

const Home = () => {
  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-40 h-screen w-screen">
          <div
            className="absolute left-0 top-0"
            style={{
              transform: "translateY(-350px) rotate(-45deg)",
              width: "560px",
              height: "1380px",
              background:
                "radial-gradient(68.54% 68.72% at 55.02% 31.46%, rgba(179, 217, 255, 0.08) 0px, rgba(26, 140, 255, 0.02) 50%, rgba(0, 115, 230, 0) 80%)",
            }}
          ></div>

          <div
            className="absolute left-0 top-0"
            style={{
              transform: "rotate(-45deg) translate(5%, -50%)",
              transformOrigin: "left top",
              width: "240px",
              height: "1380px",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(179, 217, 255, 0.06) 0px, rgba(26, 140, 255, 0.02) 80%, transparent 100%)",
            }}
          ></div>

          <div
            className="absolute left-0 top-0"
            style={{
              borderRadius: "20px",
              transform: "rotate(-45deg) translate(-180%, -70%)",
              transformOrigin: "left top",
              top: "0px",
              left: "0px",
              width: "240px",
              height: "1380px",
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(179, 217, 255, 0.04) 0px, rgba(0, 115, 230, 0.02) 80%, transparent 100%)",
            }}
          ></div>
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-center overflow-hidden px-4 pb-0 pt-20 md:mt-[4rem]">
          <h1 className="relative z-20 mx-auto max-w-7xl bg-gradient-to-b from-neutral-200 via-neutral-700 to-neutral-700 bg-clip-text py-6 text-center text-4xl font-semibold tracking-tight text-transparent [text-shadow:0px_1px_3px_rgba(27,37,80,0.14)] dark:from-neutral-800 dark:via-white dark:to-white md:text-4xl lg:text-7xl">
            <span
              style={{
                display: "inline-block",
                verticalAlign: "top",
                textDecoration: "inherit",
                textWrap: "balance",
              }}
              className=""
            >
              Transform Images into Stunning Pixel Art in Seconds
            </span>
          </h1>
          <h2 className="relative z-20 mx-auto my-4 mt-2 max-w-5xl text-center text-base font-normal text-neutral-600 dark:text-neutral-200 md:mt-4 md:text-xl">
            <span
              style={{
                display: "inline-block",
                verticalAlign: "top",
                textDecoration: "inherit",
                textWrap: "balance",
              }}
            >
              Empower your creativity with our AI-powered pixel art generator.
              Upload images, customize pixel sizes, and download high-quality
              pixel art effortlessly.
            </span>
          </h2>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col py-20">
        <Edit />
      </main>
    </>
  );
};

export { Home };
