import os
from docx2pdf import convert

# Define the input and output folder
input_folder = "D:/Workspace/Lawzy-demo/scrapeData/TÀI LIỆU"
output_folder = input_folder  # Output PDFs will be saved in the same folder

# Ensure the input folder exists
if not os.path.exists(input_folder):
    print(f"Error: The folder {input_folder} does not exist.")
    exit(1)

# Convert all .docx files in the folder to PDF
for filename in os.listdir(input_folder):
    if filename.lower().endswith(".docx"):
        docx_path = os.path.join(input_folder, filename)
        pdf_path = os.path.join(output_folder, filename[:-5] + ".pdf")
        try:
            print(f"Converting {filename} to PDF...")
            convert(docx_path, pdf_path)
            print(f"Successfully converted {filename} to {os.path.basename(pdf_path)}")
        except Exception as e:
            print(f"Error converting {filename}: {str(e)}")

print("Conversion process completed.")