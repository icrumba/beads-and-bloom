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

type OrderConfirmationProps = {
  orderNumber: number;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: string;
    customColors?: string[];
  }[];
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };
  subtotal: string;
  shipping: string;
  total: string;
  giftMessage?: string;
};

const main: React.CSSProperties = {
  backgroundColor: "#fafaf9",
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
};

const container: React.CSSProperties = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#1c1917",
  textAlign: "center" as const,
  margin: "0 0 8px 0",
};

const subheading: React.CSSProperties = {
  fontSize: "16px",
  color: "#57534e",
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const sectionStyle: React.CSSProperties = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "24px",
  marginBottom: "16px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#0d9488",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 16px 0",
};

const itemRow: React.CSSProperties = {
  marginBottom: "12px",
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

const totalLabel: React.CSSProperties = {
  fontSize: "14px",
  color: "#57534e",
};

const totalValue: React.CSSProperties = {
  fontSize: "14px",
  color: "#1c1917",
  fontWeight: "600",
};

const grandTotal: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: "700",
  color: "#0d9488",
};

const giftBox: React.CSSProperties = {
  backgroundColor: "#f0fdfa",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
};

const specialNote: React.CSSProperties = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px",
  textAlign: "center" as const,
};

const footer: React.CSSProperties = {
  textAlign: "center" as const,
  padding: "24px 0",
};

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  items,
  shippingAddress,
  subtotal,
  shipping,
  total,
  giftMessage,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your Beads & Bloom order #${orderNumber} is confirmed!`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Thank you, {customerName}!</Heading>
          <Text style={subheading}>
            Your order #{orderNumber} is confirmed and we&apos;re getting it
            ready.
          </Text>

          {/* Order Items */}
          <Section style={sectionStyle}>
            <Text style={sectionTitle}>Your Order</Text>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column>
                  <Text style={itemName}>
                    {item.name} x{item.quantity}
                  </Text>
                  {item.customColors && item.customColors.length > 0 && (
                    <Text style={itemDetail}>
                      Custom colors: {item.customColors.join(", ")}
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
            <Hr style={{ borderColor: "#e7e5e4", margin: "16px 0" }} />
            <Row>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${subtotal}</Text>
              </Column>
            </Row>
            <Row>
              <Column>
                <Text style={totalLabel}>Shipping</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>${shipping}</Text>
              </Column>
            </Row>
            <Hr style={{ borderColor: "#e7e5e4", margin: "8px 0" }} />
            <Row>
              <Column>
                <Text style={grandTotal}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={grandTotal}>${total}</Text>
              </Column>
            </Row>
          </Section>

          {/* Gift Message */}
          {giftMessage && (
            <Section style={giftBox}>
              <Text style={sectionTitle}>Gift Message</Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: "#1c1917",
                  fontStyle: "italic",
                  margin: "0",
                }}
              >
                &ldquo;{giftMessage}&rdquo;
              </Text>
            </Section>
          )}

          {/* Shipping Address */}
          <Section style={sectionStyle}>
            <Text style={sectionTitle}>Shipping To</Text>
            <Text
              style={{ fontSize: "14px", color: "#1c1917", margin: "0 0 4px" }}
            >
              {customerName}
            </Text>
            <Text style={{ fontSize: "14px", color: "#57534e", margin: "0" }}>
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
            <Text
              style={{
                fontSize: "13px",
                color: "#78716c",
                margin: "12px 0 0",
              }}
            >
              Estimated delivery: 5-10 business days
            </Text>
          </Section>

          {/* Special Notes */}
          <Section style={specialNote}>
            <Text
              style={{
                fontSize: "14px",
                color: "#92400e",
                margin: "0 0 8px",
                fontWeight: "600",
              }}
            >
              Every order includes a handwritten thank-you note from us to you!
            </Text>
            <Text style={{ fontSize: "14px", color: "#92400e", margin: "0" }}>
              $1 from your purchase is being donated to The Storehouse Community
              Center.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e7e5e4", margin: "0 0 24px" }} />

          {/* Footer */}
          <Section style={footer}>
            <Text
              style={{
                fontSize: "14px",
                color: "#78716c",
                margin: "0 0 8px",
              }}
            >
              Made with love by Beads &amp; Bloom
            </Text>
            <Link
              href={process.env.NEXT_PUBLIC_BASE_URL || "https://beadsandbloom.com"}
              style={{ fontSize: "13px", color: "#0d9488" }}
            >
              Visit our shop
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default OrderConfirmationEmail;
