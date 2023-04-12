import { Background } from "./Popup";

const Spinner = ({ width = 32, height = 32 }: Pick<React.SVGAttributes<SVGSVGElement>, "width" | "height">) => (
  <svg
    className="inline-block animate-spin"
    width={width}
    height={height}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M64 32C64 38.329 62.1232 44.5159 58.607 49.7782C55.0908 55.0406 50.0931 59.1421 44.2459 61.5641C38.3986 63.9861 31.9645 64.6199 25.7571 63.3851C19.5497 62.1504 13.8479 59.1027 9.37258 54.6274C4.8973 50.1521 1.8496 44.4503 0.614871 38.2429C-0.619856 32.0355 0.0138508 25.6014 2.43586 19.7541C4.85786 13.9069 8.95938 8.90918 14.2218 5.39297C19.4841 1.87677 25.671 -7.54726e-08 32 0V12.8C28.2026 12.8 24.4905 13.9261 21.3331 16.0358C18.1756 18.1455 15.7147 21.1441 14.2615 24.6525C12.8083 28.1608 12.4281 32.0213 13.1689 35.7457C13.9098 39.4702 15.7384 42.8913 18.4235 45.5765C21.1087 48.2616 24.5298 50.0902 28.2543 50.8311C31.9787 51.5719 35.8392 51.1917 39.3475 49.7385C42.8559 48.2853 45.8545 45.8244 47.9642 42.667C50.0739 39.5095 51.2 35.7974 51.2 32H64Z"
      fill="#34BBBD"
    />
  </svg>
);

const Loading = () => (
  <Background className="flex-col">
    <Spinner width={32} height={32} />
    <div className="mt-3 text-base text-white">Loading...</div>
  </Background>
);

export default Loading;
