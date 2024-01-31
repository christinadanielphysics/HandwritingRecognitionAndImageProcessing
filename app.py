from flask import Flask, render_template, Response, request, jsonify, redirect, url_for, send_file, send_from_directory
from match import Matcher
from predict import Predictor
import os
import datetime
from functools import lru_cache
import json
from pylatex import Document, Math, Alignat, NoEscape, Package
from fpdf import FPDF
import shutil
import pickle
import base64
from dotenv import load_dotenv
# from flask_cors import CORS


app = Flask(__name__) # creates the flask instance
# CORS(app)
load_dotenv()

tex_dictionary = {
    'beta': '\\beta',
    'chi': '\\chi',
    'delta': '\\delta',
    'gamma': '\\gamma',
    'n_uppercase': 'N',
    'zeta': '\\zeta',
    'v_uppercase': 'V',
    'exclamation_mark': '!',
    'closing_parenthesis': ')',
    'empty_set': '\\emptyset',
    'subset': '\\subseteq',
    'element_of': '\\in',
    'c_uppercase': 'C',
    'plus_or_minus': '\\pm',
    'parallel': '\\parallel',
    'vertical_bar': '|',
    'division_slash': '\\backslash',
    'psi_uppercase': '\\Psi',
    'not_superset': '\\not\\supset',
    'h_uppercase': 'H',
    'phi_uppercase': '\\Phi',
    'nu': '\\nu',
    'single_quote': "'",
    'line_integral': '\\oint',
    'e_uppercase': 'E',
    'minus': '-',
    'lambda_uppercase': '\\Lambda',
    'mu': '\\mu',
    'complex_numbers_set': '\\mathbb{C}',
    'less_than_or_equal_to': '\\leq',
    'p_uppercase': 'P',
    'angle': '\\angle',
    'asterisk': '*',
    'z_uppercase': 'Z',
    'therefore': '\\therefore',
    'o_uppercase': 'O',
    'omega_uppercase': '\\Omega',
    'delta_uppercase': '\\Delta',
    'w_uppercase': 'W',
    'divide': '\\div',
    'real_part': '\\text{Re}',
    'colon': ':',
    'pi_uppercase': '\\Pi',
    'percent': '\\%',
    'epsilon': '\\varepsilon',
    'b_uppercase': 'B',
    'ampersand': '\\&',
    'cross': '\\times',
    'similarity': '\\sim',
    'xi': '\\xi',
    'r': 'r',
    'proper_superset': '\\subset',
    'u': 'u',
    '9': '9',
    'tensor_product': '\\otimes',
    'sigma_uppercase': '\\Sigma',
    '0': '0',
    'i_uppercase': 'I',
    'minus_or_plus': '\\mp',
    'not_element_of': '\\not\\in',
    'gamma_uppercase': '\\Gamma',
    '7': '7',
    'i': 'i',
    'n': 'n',
    'period': '.',
    'g': 'g',
    'there_does_not_exist': '\\nexists',
    'closing_brace': '\\}',
    '6': '6',
    'z': 'z',
    'iota': '\\iota',
    '1': '1',
    'closing_bracket': ']',
    'd_uppercase': 'D',
    '8': '8',
    't': 't',
    'closing_inner_product': '\\rangle',
    's': 's',
    'rho': '\\rho',
    'imaginary_part': '\\text{Im}',
    'less_than': '<',
    'xi_uppercase': 'X',
    'a': 'a',
    'f': 'f',
    'o': 'o',
    'much_greater_than': '\\gg',
    'proper_subset': '\\subset',
    'h': 'h',
    'q_uppercase': 'Q',
    'intersection': '\\cap',
    'proportional_to': '\\propto',
    'l_uppercase': 'L',
    'open_brace': '\\{',
    'sigma': '\\sigma',
    'y_uppercase': 'Y',
    'equals': '=',
    'pi': '\\pi',
    'a_uppercase': 'A',
    'omikron': 'o',
    'equivalence': '\\equiv',
    'double_arrow': '\\leftrightarrow',
    't_uppercase': 'T',
    'degree': '^{\\circ}',
    'double_quote': '"',
    'caret': '\\text{\\textasciicircum}',
    'del': '\\nabla',
    'imaginary_unit': 'i',
    'left_arrow': '\\leftarrow',
    'not_subset': '\\not\\subset',
    'j_uppercase': 'J',
    'e_constant': 'e',
    'greater_than_or_equal_to': '\\geq',
    'not_equal_to': '\\neq',
    'lambda': '\\lambda',
    'r_uppercase': 'R',
    'congruent_to': '\\cong',
    'kappa': '\\kappa',
    'semicolon': ';',
    'g_uppercase': 'G',
    'multiplication_dot': '\\cdot',
    'union': '\\cup',
    'dash': '-',
    'eta': '\\eta',
    'open_inner_product': '\\langle',
    'equivalent' : '\\Leftrightarrow',
    'superset': '\\supseteq',
    'm_uppercase': 'M',
    'theta_uppercase': '\\Theta',
    'approximately_equal': '\\approx',
    'psi': '\\psi',
    'omega': '\\omega',
    'x_uppercase': 'X',
    'real_numbers_set': '\\mathbb{R}',
    'upsilon': '\\upsilon',
    'theta': '\\theta',
    'there_exists': '\\exists',
    'dollar_sign': '\\$',
    'open_parenthesis': '(',
    'implies': '\\implies',
    'u_uppercase': 'U',
    'much_less_than': '\\ll',
    'm': 'm',
    'alpha': '\\alpha',
    'for_all': '\\forall',
    'j': 'j',
    'perpendicular': '\\perp',
    'c': 'c',
    'tau': '\\tau',
    'd': 'd',
    'infinity': '\\infty',
    'v': 'v',
    'integral': '\\int',
    'q': 'q',
    'k_uppercase': 'K',
    '4': '4',
    'x': 'x',
    'phi': '\\phi',
    '3': '3',
    'backslash': '\\backslash',
    'e': 'e',
    'b': 'b',
    'k': 'k',
    'open_bracket': '[',
    'question_mark': '?',
    'l': 'l',
    's_uppercase': 'S',
    '2': '2',
    'right_arrow': '\\rightarrow',
    'y': 'y',
    '5': '5',
    'plus': '+',
    'greater_than': '>',
    'p': 'p',
    'f_uppercase': 'F',
    'w': 'w' 
 }


class PylatexManager:
    geometry_options = None
    document = None
    texStates = None
    filepath = None
    filename = None
    currentIndex = None
    found_actual_characters = None
    def __init__(self):
        self.geometry_options = {"tmargin": "1cm", "lmargin": "1cm", "rmargin": "1cm", "bmargin": "1cm"}
        self.texStates = [""]
        self.filename = "review"
        self.filepath = None # TODO: reorganize entire code to not use the static folder, except when absolutely necessary for HTML ties; import code from private folders
        self.currentIndex = 0
        self.added = [""]
        self.found_actual_characters = None
    def resetTexStates(self):
        self.texStates = [""]
        self.added = [""]
    def setWorkingDirectory(self, working_directory):
        self.filepath = working_directory # this does not include a filename
    def getWorkingDirectory(self):
        return self.filepath
    def truncate(self):
        self.texStates = self.texStates[0 : self.currentIndex + 1] # include the element at self.currentIndex but the element at self.currentIndex + 1
    
    def addEquation(self,content):  # TODO: break into align equation and inline functionality based on user input and checkbox and calling JS funciton tied to checkbox
        
        if self.addingContentMidHistory():
            self.truncate()
        
        folder_names = []
        folder = ""
        for character in content:
            if character != " ":
                folder = folder + character
            else:
                if folder != " ":
                    folder_names.append(folder)
                folder = ""
        
        expression = ""
        for folder in folder_names:
            expression = expression + tex_dictionary[folder] + " "
            print("the expression is", expression)
            print("just added",tex_dictionary[folder])
        
        self.texStates.append(NoEscape('$$'+expression+'$$'))
        self.currentIndex = self.currentIndex + 1
        self.constructDocument()
    
    def addInlineSymbols(self, content): # TODO: break into align equation and inline functionality based on user input and checkbox and calling JS function tied to checkbox
        if self.addingContentMidHistory():
            self.truncate()
        
        folder_names = []
        folder = ""
        for character in content:
            if character != " ":
                folder = folder + character
            else:
                if folder != " ":
                    folder_names.append(folder)
                folder = ""

        
        expression = ""
        for folder in folder_names:
            expression = expression + tex_dictionary[folder] + " "
            print("the expression is", expression)
            print("just added",tex_dictionary[folder])
        
        self.texStates.append(NoEscape('$'+expression+'$'))
        self.currentIndex = self.currentIndex + 1
        self.constructDocument()
    def addText(self, content):
        if self.addingContentMidHistory():
            self.truncate()
        self.texStates.append(content)
        self.currentIndex = self.currentIndex + 1
        self.constructDocument()
    def saveInstance(self): # save what is added
        self.added = pickle.dumps(self.added)
    def load_tex_states(self,pickled_tex_states): # do the same process when an existing document is loaded
        self.texStates = pickle.loads(pickled_tex_states)
        self.currentIndex = len(self.texStates) - 1
    def get_pickled_tex_states(self):
        return self.added
    def constructDocument(self):
        self.found_actual_characters = False
        self.document = Document(geometry_options=self.geometry_options)
        self.document.preamble.append(Package('amsfonts'))  # import amsfonts package
        self.document.preamble.append(Package('amsmath'))  # import amsmath package
        self.document.preamble.append(Package('amssymb')) # import amssymb package
        self.document.preamble.append(Package('amstext')) # import amssymb package

        self.added = [""]
        for index,part in enumerate(self.texStates):
            if index <= self.currentIndex:
                print("the part that is being added to the document is", part)
                self.document.append(part)
                if part != "" and part != " ":
                    self.found_actual_characters = True
                    self.added.append(part)
        self.saveInstance()
    def undo(self): 
        if self.currentIndex != 0:
            self.currentIndex = self.currentIndex - 1
        self.constructDocument()
    def redo(self):
        if self.currentIndex != len(self.texStates) - 1: 
            self.currentIndex = self.currentIndex + 1
        self.constructDocument()  
    def addingContentMidHistory(self):
        if self.currentIndex != len(self.texStates) - 1:
            return True  
        else:
            return False  
    def makePDF(self):
        self.document.generate_pdf(self.filepath+self.filename)
    def makeTexFile(self):
        self.document.generate_tex(self.filepath+self.filename)


class BlankTexManager:
    complete_path_to_file = None
    def __init__(self):
        self.complete_path_to_file = None
    def setWorkingDirectory(self):
        self.complete_path_to_file = pylatex_manager.filepath + pylatex_manager.filename + ".tex"
    def make_blank_tex_file(self):
        now = datetime.datetime.now() 
        new_tex_file = open(self.complete_path_to_file,'w') # make a blank tex file 
        new_tex_file.close()

class BlankPDFManager:
    complete_path_to_file = None
    def __init__(self):
        self.complete_path_to_file = None
    def setWorkingDirectory(self):
        self.complete_path_to_file = pylatex_manager.filepath + pylatex_manager.filename + ".pdf"
    def make_blank_pdf_file(self):
        pdf = FPDF()
        pdf.add_page()
        pdf.output(self.complete_path_to_file) # make a blank PDF 



pylatex_manager = PylatexManager()
blank_tex_manager = BlankTexManager()
blank_pdf_manager = BlankPDFManager()

matcher = Matcher()


# Rendering HTML Pages

@app.route('/')
@app.route('/login')
def index():
    return render_template('login.html')

@app.route('/documents')
def documents():
    # matcher.match_images_with_symbols() 
    matcher.load_model_list()
    return render_template('documents.html')

@app.route('/create')
def create():
    matcher.load_model_list()
    return render_template('create.html')



# Predicting Symbols

@app.route('/send_for_prediction_image', methods=['POST'])
def send_for_prediction_image():
    data = request.get_json()
    image_data = data['imageData'] 
    # Decode base64 
    image_bytes = base64.b64decode(image_data.replace('data:image/png;base64,', ''))
    filename = 'for_prediction.png'
    directory = pylatex_manager.getWorkingDirectory()
    file_path = os.path.join(directory, filename)
    with open(file_path, 'wb') as f:
        f.write(image_bytes)
    return {'status': 'ok'}


@app.route('/remove_previous_image', methods=['POST'])
def removePreviousImage():
    filename = 'for_prediction.png'
    directory = pylatex_manager.getWorkingDirectory()
    file_path = os.path.join(directory, filename)

    if os.path.exists(file_path):
        os.remove(file_path)
        return jsonify("image was removed")
    else:
        return jsonify("image does not exist yet")

@lru_cache(maxsize=0)
@app.route('/predict_symbol', methods=['POST'])
def predict_symbol():
    filename = 'for_prediction.png'
    directory = pylatex_manager.getWorkingDirectory()
    file_path = os.path.join(directory, filename)

    predictor = Predictor(matcher, file_path)
    prediction_list = predictor.predict_symbol_on_canvas().tolist() # convert from a numpy array to a normal array
    return jsonify(prediction_list)




# Adding Content

@app.route('/add_symbols_to_document', methods=['POST'])
def add_symbols_to_document():
    tex_state = json.loads(request.data)
    print("this is the tex state",tex_state)
    pylatex_manager.addEquation(tex_state)
    return jsonify("the array was received as a list")

@app.route('/add_text_to_document', methods=['POST'])
def add_text_to_document():
    text_state = request.data.decode('utf-8') # this is the final state of the text area
    print("this is the text state",text_state)
    pylatex_manager.addText(text_state)
    return jsonify("the text was received as a string")



# Managing Different Projects

@app.route('/reset_tex_states', methods=['POST']) # new project
def reset_tex_states():
    pylatex_manager.resetTexStates()
    return jsonify("the tex states are ready")


@app.route('/unload_pickled_tex_states', methods=['GET']) # save
def unload_pickled_tex_states():
    pickled_states = pylatex_manager.get_pickled_tex_states()
    return Response(pickled_states, mimetype='application/octet-stream')
    

@app.route('/load_pickled_tex_states', methods=['POST']) # edit project
def load_pickled_tex_states():
    pickled_tex_states = request.data
    pylatex_manager.load_tex_states(pickled_tex_states)
    return jsonify("the pickled tex states were loaded")



# Undo and Redo

@app.route('/undo_for_review_section', methods=['POST'])
def undo_for_review_section():
    pylatex_manager.undo()
    return jsonify("done")

@app.route('/redo_for_review_section', methods=['POST'])
def redo_for_review_section():
    pylatex_manager.redo()
    return jsonify("done")



# Managing Files

class FileManager:
    complete_path_to_file = None
    initial_modification_time = None
    def __init__(self,complete_path_to_file):
        self.complete_path_to_file = complete_path_to_file
        self.initial_modification_time = 0
        if os.path.exists(self.complete_path_to_file):
            self.initial_modification_time = os.path.getmtime(self.complete_path_to_file)
    def get_modification_time(self):
        return os.path.getmtime(self.complete_path_to_file)
    def wait_for_file_update(self): # assumption: filename doesn't change 
        while True:
            if os.path.getmtime(self.complete_path_to_file) > self.initial_modification_time:
                break # break out of the while loop
        return


class User:
    uid = None
    def __init__(self, uid):
        self.uid = uid



# Directories 
        
@app.route('/remove_working_directory', methods=['POST'])
def remove_working_directory():
    the_working_directory = pylatex_manager.getWorkingDirectory()
    print("THE WORKING DIRECTORY IS", the_working_directory)
    if the_working_directory != None and os.path.exists(the_working_directory):
        shutil.rmtree(the_working_directory)
    return jsonify("done")


@app.route('/set_working_directory', methods=['POST'])
def set_working_directory():
    working_directory = request.data.decode('utf-8') 
    if not os.path.exists(working_directory):
        os.makedirs(working_directory)
    pylatex_manager.setWorkingDirectory(working_directory)
    blank_tex_manager.setWorkingDirectory()
    blank_pdf_manager.setWorkingDirectory()
    return jsonify("the working directory was set")

@app.route('/path_to_pdf')
def path_to_review_pdf():
     filename = pylatex_manager.filename + ".pdf"
     return send_from_directory(pylatex_manager.getWorkingDirectory(), filename)


# Making Files

@app.route('/get_new_tex_file', methods=['POST'])
def get_new_tex_file():
    file_manager = FileManager(blank_tex_manager.complete_path_to_file)

    blank_tex_manager.make_blank_tex_file()

    file_manager.wait_for_file_update()

    return send_file(blank_tex_manager.complete_path_to_file, mimetype='application/x-tex')

@app.route('/get_updated_tex_file', methods=['POST'])
def get_updated_tex_file():
    file_manager = FileManager(blank_tex_manager.complete_path_to_file)

    if (pylatex_manager.found_actual_characters):
        print("ACUTAL CHARACTERS WERE FOUND WHEN UPDATING TEX") 
        pylatex_manager.makeTexFile()
    else: 
        print("ACUTAL CHARACTERS WERE NOT FOUND WHEN UPDATING TEX") 
        blank_tex_manager.make_blank_tex_file()

    file_manager.wait_for_file_update()

    return send_file(blank_tex_manager.complete_path_to_file, mimetype='application/x-tex')

@app.route('/get_new_pdf_file', methods=['POST'])
def get_new_pdf_file(): 
    file_manager = FileManager(blank_pdf_manager.complete_path_to_file)

    blank_pdf_manager.make_blank_pdf_file()

    file_manager.wait_for_file_update()

    return send_file(blank_pdf_manager.complete_path_to_file, mimetype='application/pdf')

@app.route('/update_pdf_for_display', methods=['POST'])
def update_pdf_for_display():
    file_manager = FileManager(blank_pdf_manager.complete_path_to_file)

    if (pylatex_manager.found_actual_characters):
        print("ACTUAL CHARACTERS WERE FOUND WHEN UPDATING PDF")
        pylatex_manager.makePDF()
    else:
        print("ACTUAL CHARACTERS WERE NOT FOUND WHEN UPDATING PDF")
        blank_pdf_manager.make_blank_pdf_file()

    file_manager.wait_for_file_update()

    return send_file(blank_pdf_manager.complete_path_to_file,mimetype='application/pdf')


# Saving Files

@app.route('/save_tex', methods=['POST'])
def save_tex():
    file = request.files['file']
    print("the filepath is", pylatex_manager.filepath)
    file.save(pylatex_manager.filepath + "review.tex")   
    return jsonify("success")

@app.route('/save_pdf', methods=['POST'])
def save_pdf():
    file = request.files['file']
    print("the filepath is", pylatex_manager.filepath)
    file.save(pylatex_manager.filepath + "review.pdf")   
    return jsonify("success")



# Main


if __name__ == "__main__":
    app.run(host="0.0.0.0", port='8080', debug=False) 





