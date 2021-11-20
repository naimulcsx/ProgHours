const Logo = ({ width, height }) => {
  return (
    <svg
      width={width || 64}
      height={height || 64}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.6924 1.97505C29.0954 0.141618 33.2047 0.141618 36.6077 1.97505L56.3361 12.6041C60.012 14.5845 62.3002 18.3973 62.3002 22.5419V42.658C62.3002 46.8026 60.012 50.6155 56.3361 52.5959L36.6077 63.2249C33.2047 65.0583 29.0954 65.0583 25.6924 63.2249L5.96405 52.5959C2.2882 50.6155 0 46.8026 0 42.658L0 22.5419C0 18.3973 2.2882 14.5845 5.96404 12.6041L25.6924 1.97505Z"
        fill="currentColor"
      />
      <ellipse
        cx="31.1503"
        cy="31.9381"
        rx="11.8649"
        ry="11.7519"
        fill="#FBFAFC"
      />
    </svg>
  )
}

export default Logo