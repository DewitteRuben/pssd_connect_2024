import { Image } from "@chakra-ui/react";

type CircularImageProps = {
  src: string;
  alt?: string;
};

const CircularImage: React.FC<CircularImageProps> = ({ src, alt }) => {
  return <Image border="1px solid gray" borderRadius="full" boxSize="150px" src={src} alt={alt} />;
};

export default CircularImage;
