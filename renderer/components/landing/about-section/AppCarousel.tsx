import '../animations/animate.css';

import AppCard from './AppCard';
import { AppProps, apps } from './appDetails';

const AppCarousel = () => {
  return (
    <div className="animate absolute bottom-5 flex w-[1100%] border-[1px] border-[#0E1016] sm:w-[680%] md:w-[710%] lg:w-[600%] xl:w-[400%] gap-1">
      <div className="mx-auto flex w-[50%] justify-around gap-1 lg:my-[1px]">
        {apps.map((app: AppProps, index: number) => (
          <AppCard key={index} title={app.title} artist={app.artist} image={app.image} />
        ))}
      </div>
      <div className="mx-auto flex w-[50%] justify-around gap-1 lg:my-[1px]">
        {apps.map((app: AppProps, index: number) => (
          <AppCard key={index} title={app.title} artist={app.artist} image={app.image} />
        ))}
      </div>
    </div>
  );
};

export default AppCarousel;
