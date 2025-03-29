import requests

# Define the URL for the image upload endpoint
url = 'http://127.0.0.1:8000/upload/'

# Path to the image file you want to upload
image_path = 'SUV_렉스턴-56.jpg'

# Open the image file in binary mode
with open(image_path, 'rb') as img:
    # Define the files dictionary
    files = {'image': img}
    
    # Make the POST request to upload the image
    response = requests.post(url, files=files)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response
        result = response.json()
        print('Response from server:', result)
    else:
        print('Failed to upload image. Status code:', response.status_code)
