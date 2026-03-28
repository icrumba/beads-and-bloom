import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Section,
  Hr,
  Row,
  Column,
  Heading,
  Link,
  Preview,
} from "@react-email/components";

type AdminNotificationProps = {
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    quantity: number;
    price: string;
    customColors?: string[];
  }[];
  total: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
};

const main: React.CSSProperties = {
  backgroundColor: "#fafaf9",
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "32px 20px",
  maxWidth: "480px",
};

const heading: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "700",
  color: "#1c1917",
  margin: "0 0 4px 0",
};

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "12px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#0d9488",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 12px 0",
};

const itemName: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#1c1917",
  margin: "0",
};

const itemDetail: React.CSSProperties = {
  fontSize: "13px",
  color: "#78716c",
  margin: "2px 0 0 0",
};

const grandTotal: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#0d9488",
};

export function AdminNotificationEmail({
  orderNumber,
  customerName,
  customerEmail,
  items,
  total,
  shippingAddress,
}: AdminNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New order #${orderNumber} from ${customerName}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Order #{orderNumber}</Heading>
          <Text
            style={{ fontSize: "14px", color: "#57534e", margin: "0 0 20px" }}
          >
            From {customerName}
          </Text>

          {/* Customer Info */}
          <Section style={sectionStyle}>
            <Text style={sectionTitle}>Customer</Text>
            <Text style={{ fontSize: "14px", color: "#1c1917", margin: "0" }}>
              {customerName}
            </Text>
            <Link
              href={`mailto:${customerEmail}`}
              style={{
                fontSize: "14px",
                color: "#0d9488",
                textDecoration: "underline",
              }}
            >
              {customerEmail}
            </Link>
          </Section>

          {/* Items */}
          <Section style={sectionStyle}>
            <Text style={sectionTitle}>Items</Text>
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: "8px" }}>
                <Column>
                  <Text style={itemName}>
                    {item.name} x{item.quantity}
                  </Text>
                  {item.customColors && item.customColors.length > 0 && (
                    <Text style={itemDetail}>
                      Custom: {item.customColors.join(", ")}
                    </Text>
                  )}
                </Column>
                <Column align="right">
                  <Text style={itemName}>
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            ))}
            <Hr style={{ borderColor: "#e7e5e4", margin: "12px 0" }} />
            <Row>
              <Column>
                <Text style={grandTotal}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={grandTotal}>${total}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping */}
          <Section style={sectionStyle}>
            <Text style={sectionTitle}>Ship To</Text>
            <Text style={{ fontSize: "14px", color: "#1c1917", margin: "0" }}>
              {shippingAddress.line1}
              {shippingAddress.line2 && (
                <>
                  <br />
                  {shippingAddress.line2}
                </>
              )}
              <br />
              {shippingAddress.city}, {shippingAddress.state}{" "}
              {shippingAddress.zip}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e7e5e4", margin: "0 0 16px" }} />
          <Text
            style={{
              fontSize: "13px",
              color: "#78716c",
              textAlign: "center" as const,
            }}
          >
            Manage this order in{" "}
            <Link
              href={`${process.env.NEXT_PUBLIC_BASE_URL || "https://beadsandbloom.com"}/admin/orders`}
              style={{ color: "#0d9488" }}
            >
              Admin Dashboard
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default AdminNotificationEmail;
