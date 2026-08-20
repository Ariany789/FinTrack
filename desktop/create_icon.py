from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


output_path = Path(__file__).with_name("fintrack.ico")
canvas = Image.new("RGBA", (256, 256), "#0B0F0E")
draw = ImageDraw.Draw(canvas)
draw.rounded_rectangle((16, 16, 240, 240), radius=48, fill="#15241C", outline="#39FF88", width=8)
draw.line((60, 178, 106, 128, 146, 148, 204, 72), fill="#39FF88", width=14, joint="curve")
draw.polygon(((194, 72), (207, 67), (203, 84)), fill="#39FF88")
font = ImageFont.truetype("arialbd.ttf", 74)
draw.text((54, 46), "F", font=font, fill="#FFFFFF")
canvas.save(output_path, sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
