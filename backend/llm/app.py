from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import json

def load_model(model_path: str, device: str = None):
    """
    Load a locally downloaded LLM model.

    Args:
        model_path (str): Path to the locally downloaded model.
        device (str): Device to load the model (e.g., 'cpu' or 'cuda').
                      Defaults to 'cuda' if available, otherwise 'cpu'.

    Returns:
        model: The loaded model.
        tokenizer: The tokenizer for the model.
    """
    device = device or ("cuda" if torch.cuda.is_available() else "cpu")

    print(f"Loading model from {model_path} to {device}...")
    tokenizer = AutoTokenizer.from_pretrained(model_path)
    model = AutoModelForCausalLM.from_pretrained(model_path)
    model = model.to(device)

    print("Model loaded successfully.")
    return model, tokenizer, device

def generate_response(model, tokenizer, device, prompt: str, max_length: int = 50):
    """
    Generate a response from the model based on a given prompt.

    Args:
        model: The loaded LLM model.
        tokenizer: The tokenizer for the model.
        device: The device on which the model is running.
        prompt (str): Input text prompt.
        max_length (int): Maximum length of the generated response.

    Returns:
        str: The generated response text.
    """
    messages = [
        {"role": "system", "content": "Given a genre, crtitize each one and why they might be bad for the community"},
        {"role": "user", "content": prompt}
    ]
    text = tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True
    )
    model_inputs = tokenizer([text], return_tensors="pt").to(model.device)

    generated_ids = model.generate(
        **model_inputs,
        # max_new_tokens=512
        max_length=max_length
    )
    generated_ids = [
        output_ids[len(input_ids):] for input_ids, output_ids in zip(model_inputs.input_ids, generated_ids)
    ]

    response = tokenizer.batch_decode(generated_ids, skip_special_tokens=True)[0]

    return response

def lambda_handler(event, context):
    # Replace 'local_model_path' with the path to your downloaded model
    local_model_path = "./saved_model"
    model, tokenizer, device = load_model(local_model_path)

    # Example prompt
    user_prompt = event['body']

    # Generate response
    response = generate_response(model, tokenizer, device, user_prompt, 60)
    print(response)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*'
        },
        # 'body': json.dumps({"res": "OK"})
        'body': json.dumps({"res": response.strip()})
    }