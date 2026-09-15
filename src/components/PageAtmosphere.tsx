type PageAtmosphereVariant =
  | "home"
  | "story"
  | "map"
  | "guide"
  | "course"
  | "stamp";

export default function PageAtmosphere({
  variant,
}: {
  variant: PageAtmosphereVariant;
}) {
  return (
    <div
      className="page-atmosphere"
      data-variant={variant}
      aria-hidden="true"
    >
      <div className="page-atmosphere-grid" />
      <div className="page-atmosphere-orb page-atmosphere-orb-one" />
      <div className="page-atmosphere-orb page-atmosphere-orb-two" />
      <div className="page-atmosphere-orb page-atmosphere-orb-three" />
      <div className="page-atmosphere-glints">
        {Array.from({ length: 10 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="page-atmosphere-nodes">
        {Array.from({ length: 14 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="page-atmosphere-rings">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
