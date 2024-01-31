import os
import numpy
import cv2

from sklearn.svm import LinearSVC
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

import json
import pickle

class Matcher:

    drawing_canvas_width = None
    drawing_canvas_height = None
    model_list = None
    symbol_list = None

    def __init__(self):
        self.drawing_canvas_width = 200
        self.drawing_canvas_height = 200
        self.model_list = [LinearSVC(),GaussianNB(),DecisionTreeClassifier(),KNeighborsClassifier(),RandomForestClassifier(),LogisticRegression()]

        # This is where all the symbols are defined
        folder_names = []
        for name in os.listdir('./Images'): # get all files and folders in the directory
            if os.path.isdir(os.path.join('.',name)): # check if each item is a directory=folder
                folder_names.append(name)

        self.symbol_list = folder_names #["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"] 

    def count_files_for_symbol(folder_path):
        number_of_files = 0
        for root, dirs, files in os.walk(folder_path): # no slash is needed at the right-most end
            number_of_files += len(files)
        return number_of_files

    def match_images_with_symbols(self):

        image_list = numpy.array([])
        class_list = numpy.array([])

        directory = "./Images/"

        total_number_of_images = 0
        for symbol in self.symbol_list:
            folder_path = directory + symbol # folder with images for that symbol
            print("the folder path is", folder_path)
            for root, dirs, files in os.walk(folder_path):
                for image_number,filename in enumerate(files):
                    path = folder_path + '/' + filename
                    image = cv2.imread(path,cv2.IMREAD_UNCHANGED)[:,:,3] # an array of arrays of integers from 0 to 255
                    image = image.reshape(self.drawing_canvas_width*self.drawing_canvas_height) # reshape image to a one-dimensional array
                    image_list = numpy.append(image_list,image)
                    class_list = numpy.append(class_list,symbol)
                    total_number_of_images = total_number_of_images + 1

        image_list = image_list.reshape(total_number_of_images, self.drawing_canvas_width*self.drawing_canvas_height) # each row is a one-dimensional array representing an image

        for model in self.model_list:
            model.fit(image_list,class_list)

        # Open a file in binary write mode
        with open('model_list.pkl', 'wb') as f: 
            # Pickle the model_list and save to the file
            pickle.dump(self.model_list, f)
    
    def load_model_list(self):
        # Open the file in binary read mode
        with open('model_list.pkl', 'rb') as f:
            # Load the pickled list from the file 
            self.model_list = pickle.load(f) 
