package com.controllers.pocketAction;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.DAO.pocket.InstaceDAO;
import com.DAO.pocket.UserDAO;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Transaction;
import com.models.pocket.Instance;
import com.models.pocket.User;

public class InstanceService {
	
	public void createInstance(Instance instance, User user){
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction txn = datastore.beginTransaction();
		
		//Create instance
		InstaceDAO newInstance = new InstaceDAO();
		newInstance.createInstance(txn, instance);
		
		//Create user
		UserDAO newUser = new UserDAO();
		newUser.createUser(txn, user);
		
		txn.commit();
	}

}
