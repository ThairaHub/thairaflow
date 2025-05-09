const IFrame = ({url, height, borderRadius}) => (
    <div>
      <iframe scrolling="no" 
        style={{
          width: "100%",
          height: height || "78vh",
          border: "none",
          borderRadius: borderRadius || "30px",
          padding: 12,
          overflow: "hidden",
          zIndex: 999999,
        }}
        src={url}
        title="GeeksforGeeks"
      />
    </div>
  );

  export default IFrame