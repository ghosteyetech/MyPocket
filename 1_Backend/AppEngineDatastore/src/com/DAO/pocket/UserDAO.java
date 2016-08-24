package com.DAO.pocket;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Transaction;
import com.models.pocket.Instance;
import com.models.pocket.User;
import com.util.pocket.MyPocketConstance;

public class UserDAO {
	
	public void createUser(Transaction txn, User user){
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		Entity entityInstance = new Entity(MyPocketConstance.instanceKind, user.getInstanceId());
		
		Key instanceKeyAncestor = entityInstance.getKey();
		
		Entity entityuser = new Entity(MyPocketConstance.userKind , user.getUserEmail(), instanceKeyAncestor);//(kind,id, AncestorKey)		
		
		entityuser.setProperty("userEmail", user.getUserEmail());
		entityuser.setProperty("userPassword", user.getUserPassword());	
		entityuser.setProperty("instanceId", user.getInstanceId());
		
		datastore.put(txn, entityuser);
		
	}

}
