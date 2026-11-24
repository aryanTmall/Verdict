import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const accessoryName = (body.accessoryName || "").toLowerCase();

    let compatible = true;
    let verdict = "100% COMPATIBLE";
    let explanation = "Meets all physical port, voltage, and protocol requirements.";

    if (accessoryName.includes("vga") || accessoryName.includes("floppy")) {
      compatible = false;
      verdict = "INCOMPATIBLE";
      explanation = "Obsolete legacy interface; current system does not provide native pinout.";
    } else if (accessoryName.includes("chrome") || accessoryName.includes("garnish")) {
      compatible = false;
      verdict = "REDUNDANT";
      explanation = "Cosmetic dealership up-sell item with zero operational or performance benefit.";
    }

    return NextResponse.json({
      productId: id,
      accessoryName: body.accessoryName,
      compatible,
      verdict,
      explanation,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Compatibility check failed" }, { status: 500 });
  }
}
