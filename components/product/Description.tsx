import { Card } from "antd";
import { Content } from "antd/lib/layout/layout";

interface ProductProps {
  description: string;
}

export const Description: React.FC<ProductProps> = ({description}: ProductProps) => {
  return (
    <Card
      title={"Product Specifications"}
      hoverable
      style={{ width: "100%", marginTop: "40px" }}
    >
      <Content
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      ></Content>
    </Card>
  );
};
