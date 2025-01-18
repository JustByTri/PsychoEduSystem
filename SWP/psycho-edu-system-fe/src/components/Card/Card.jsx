const Card = ({
  title,
  description,
  image,
  children,
  className = "",
  onClick,
  footer,
}) => {
  return (
    <div
      className={`rounded-lg shadow-md bg-white overflow-hidden ${className}`}
      onClick={onClick}
    >
      {/* Card Image */}
      {image && (
        <div className="w-full h-48">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Card Content */}
      <div className="p-4">
        {title && <h3 className="text-xl font-semibold mb-2">{title}</h3>}

        {description && <p className="text-gray-600 mb-4">{description}</p>}

        {children}
      </div>

      {/* Card Footer */}
      {footer && <div className="px-4 py-3 bg-gray-50 border-t">{footer}</div>}
    </div>
  );
};

export default Card;
