from transformers import AutoModelForCausalLM, AutoTokenizer
import os

# transformers
# torch
def save_model(model_name: str, save_directory: str):
    """
    Download and save a pre-trained model and its tokenizer locally.

    Args:
        model_name (str): Name of the model from the Hugging Face Model Hub.
        save_directory (str): Directory to save the model and tokenizer.

    Returns:
        None
    """
    if not os.path.exists(save_directory):
        os.makedirs(save_directory)

    print(f"Downloading model '{model_name}'...")
    model = AutoModelForCausalLM.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    print(f"Saving model and tokenizer to '{save_directory}'...")
    model.save_pretrained(save_directory)
    tokenizer.save_pretrained(save_directory)

    print("Model and tokenizer saved successfully.")

if __name__ == "__main__":
    # Specify the name of the model and the directory to save it
    model_name = "Qwen/Qwen2.5-1.5B-Instruct"  # Replace with your desired model name
    model_name = "KingNish/Qwen2.5-0.5b-Test-ft"  # Replace with your desired model name
    save_directory = "./saved_model"

    save_model(model_name, save_directory)
