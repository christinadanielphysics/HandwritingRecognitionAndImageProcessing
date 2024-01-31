import cv2
import numpy
import os
from datetime import datetime


class Predictor:

    matcher = None
    model_list = None
    file_path = None

    def __init__(self, matcher, file_path):
        self.matcher = matcher
        self.model_list = matcher.model_list
        self.file_path = file_path 
    def predict_symbol_on_canvas(self):
        while not os.path.exists(self.file_path):
            pass
        image_to_predict = cv2.imread(self.file_path,cv2.IMREAD_UNCHANGED)[:,:,3] # for a png, which can have a transparent background, the fourth channel is the alpha channel
        image_to_predict = image_to_predict.reshape(self.matcher.drawing_canvas_width*self.matcher.drawing_canvas_height) # make shape compatible with images in image_list
        
        prediction_list = numpy.array([])
        for model in self.model_list:
            prediction = model.predict([image_to_predict])[0] # the assumption is that the model has already been trained
            prediction_list = numpy.append(prediction_list,prediction)
        return numpy.unique(prediction_list) # minor note: prediction_list is not modified by numpy.unique
    


    


