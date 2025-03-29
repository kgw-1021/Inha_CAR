import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from torchsummary import summary
import numpy as np
from torchvision.models import efficientnet_b0  # Importing EfficientNet from torchvision.models
from torch.utils.data import DataLoader
import os

# Function to compile and train the model
def compile(model, train_loader, test_loader, epochs, optimizer, loss, device):
    train_acc = []
    train_loss = []
    test_acc = []
    test_loss = []

    for epoch in range(epochs):
        model.train()
        num_train = 0
        num_correct_train = 0
        total_train_loss = 0.0

        print(f"Epoch {epoch+1}/{epochs}")

        for (xList, yList) in train_loader:
            xList, yList = xList.to(device), yList.to(device)
            optimizer.zero_grad()

            outputs = model(xList)
            train_loss_func = loss(outputs, yList)
            train_loss_func.backward()
            optimizer.step()

            num_train += len(yList)
            total_train_loss += train_loss_func.item() * len(yList)
            predicts = torch.max(outputs.data, 1)[1]
            num_correct_train += (predicts == yList).sum().item()

        train_acc.append(num_correct_train / num_train)
        train_loss.append(total_train_loss / num_train)
        print(f"    - train_acc: {train_acc[-1]:.5f}, train_loss: {train_loss[-1]:.5f}")

        model.eval()
        num_test = 0
        num_correct_test = 0
        total_test_loss = 0.0

        with torch.no_grad():
            for (xList, yList) in test_loader:
                xList, yList = xList.to(device), yList.to(device)
                outputs = model(xList)
                test_loss_func = loss(outputs, yList)

                num_test += len(yList)
                total_test_loss += test_loss_func.item() * len(yList)
                predicts = torch.max(outputs.data, 1)[1]
                num_correct_test += (predicts == yList).sum().item()

        test_acc.append(num_correct_test / num_test)
        test_loss.append(total_test_loss / num_test)
        print(f"    - test_acc: {test_acc[-1]:.5f}, test_loss: {test_loss[-1]:.5f}")

    return train_loss, train_acc, test_loss, test_acc

# Function to fix random seed for reproducibility
def fix_seed(seed):
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
    np.random.seed(seed)

fix_seed(1111)

# Configuration dictionary
config = {
    "batch_size": 64,
    "learning_rate": 0.0001,
    "epochs": 10,
    "device": torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
}

# Transformations for the dataset
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),  
    transforms.RandomRotation(10),  
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,)),
    transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))  # Normalization for RGB images
])

# Load MNIST dataset
trainset = torchvision.datasets.ImageFolder(root="/content/train/SUV", transform=transform)
class_to_idx = trainset.class_to_idx

# Load the test dataset with the same class-to-index mapping as the train dataset
testset = torchvision.datasets.ImageFolder(root="/content/test/SUV", transform=transform)
testset.class_to_idx = class_to_idx
testset.classes = trainset.classes

trainloader = DataLoader(trainset, batch_size=config['batch_size'], shuffle=True, pin_memory=True)
testloader = DataLoader(testset, batch_size=config['batch_size'], shuffle=True, pin_memory=True)

print(trainset.classes)
print(testset.classes)

# Load pre-trained EfficientNet model and modify the classifier
model = efficientnet_b0(pretrained=True)
num_features = model.classifier[1].in_features
#num_features = model.fc.in_features

model.classifier = nn.Sequential(
    nn.Dropout(0.5),  # Add dropout for regularization
    nn.Linear(num_features, len(trainset.classes))
)
model.to(config['device'])

# Loss function and optimizer
loss = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=config["learning_rate"])

# Train the model
result = compile(model, trainloader, testloader, config["epochs"], optimizer, loss, config['device'])

# Save the trained model
torch.save(model.state_dict(), "model_Brand_efficientnet_b0.pth")
print('Learning Finished!')
