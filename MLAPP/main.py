from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import sklearn
import joblib
import xgboost as xgb


app = FastAPI()


class InputData(BaseModel):
    amount: float
    nameDest: str
    type : int
    oldbalanceOrg: float
    newbalanceOrig: float
    oldbalanceDest: float
    newbalanceDest: float


class Prediction:
    def decrypt_input(self, input_data):
        print(input_data)
        return input_data

    def preprocess_input(self, input_data):
        df = pd.DataFrame(input_data, index=[0])
        
        if(input_data["nameDest"][0] == 'C'):
            df['nameDest'] = 0
        else:
            df['nameDest'] = 1

        if(input_data["type"] == 0):
            df['type_PAYMENT'] = 1
            df['type_TRANSFER'] = 0
            df['type_CASH_OUT'] = 0
            df['type_DEBIT'] = 0
            df['type_CASH_IN'] = 0
        
        elif(input_data["type"] == 1):
            df['type_TRANSFER'] = 0
            df['type_PAYMENT'] = 0
            df['type_CASH_OUT'] = 0
            df['type_DEBIT'] = 1
            df['type_CASH_IN'] = 0
        
        elif(input_data["type"] == 2):
            df['type_TRANSFER'] = 1
            df['type_PAYMENT'] = 0
            df['type_CASH_OUT'] = 0
            df['type_DEBIT'] = 0
            df['type_CASH_IN'] = 0

        elif(input_data["type"] == 3):
            df['type_TRANSFER'] = 0
            df['type_PAYMENT'] = 0
            df['type_CASH_OUT'] = 1
            df['type_DEBIT'] = 0
            df['type_CASH_IN'] = 0
        
        elif(input_data["type"] == 4):
            df['type_TRANSFER'] = 0
            df['type_PAYMENT'] = 0
            df['type_CASH_OUT'] = 0
            df['type_DEBIT'] = 0
            df['type_CASH_IN'] = 1
        

        df.drop('type', axis=1, inplace=True)

        new_order = ['amount', 'oldbalanceOrg', 'newbalanceOrig', 'nameDest','oldbalanceDest', 'newbalanceDest', 'type_CASH_IN', 'type_CASH_OUT','type_DEBIT', 'type_PAYMENT', 'type_TRANSFER']
        df = df[new_order]
        print(df)
        return df

    def predict(self, input_data):
        scaler = joblib.load("scaler_weights.joblib")
        input_data = scaler.transform(input_data)
        
        model = joblib.load("xgboost_model.joblib")
        prediction = model.predict(input_data).tolist()

        return {"prediction": prediction}

prediction_instance = Prediction()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/predict/")
def predict(input_data: InputData):
    decrypted_data = prediction_instance.decrypt_input(input_data.dict())
    preprocessed_data = prediction_instance.preprocess_input(decrypted_data)
    result = prediction_instance.predict(preprocessed_data)
    return result
