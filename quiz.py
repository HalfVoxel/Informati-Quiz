import json
import random

def main ():
	f = open("qa.json")
	data = json.loads(f.read())
	
	solved = 0
	total = 0

	cats = data['categories']

	while len(cats) > 0:

		print ("Choose one of the following categories")
		for i in range(0,len(cats)):
			print ("[" + str(i+1)  + "] " + cats[i])

		s = -1
		while True:
			val = raw_input()
			try:
				s = int(val)
				if s > 0 and s <= len (cats):
					break
			except:
				pass

			print ("Please enter a number in the range [" + "1" + "," + str(len(cat))+"]")

		print ("")
		cat = cats[s-1]
		questions = [x for x in data["questions"] if x['cat'] == cat]

		random.shuffle(questions)
		for obj in questions:
			
			#print (obj)
			print (obj['q'])
			v = list(obj['a'])
			corr = v[0]
			random.shuffle(v)
			for i in range(0,len(v)):
				print ("[" + str(i+1) +"] " + v[i])
		
			s = -1
			while s == -1:
				val = raw_input()
				try:
					s = int(val)
				except:
					print ("Please enter a number in the range [" + "1" + "," + str(len(v))+"]")
			
			print ("\nYou answered " + str(s))
			total += 1
			if (v[s-1] == corr):
				print ("Correct!")
				solved += 1
			else:
				print ("Sorry, the correct answer was: " + corr)
			
			print ("You have solved " + str(solved) + " of " + str(total) + " question")

			try:
				print (obj['desc'])
			except:
			    pass

			print ("")
			raw_input()

		print ("Yay! You solved all the questions in category: " + cat +"\n")
	
	print ("Congratulations! You have completed the WHOLE QUIZ!!! You must be an awesome haxxer!")
	
main ()
