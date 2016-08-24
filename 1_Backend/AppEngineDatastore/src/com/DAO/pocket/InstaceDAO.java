package com.DAO.pocket;

import java.util.Date;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Transaction;
import com.models.pocket.Instance;
import com.models.pocket.User;
import com.util.pocket.MyPocketConstance;

public class InstaceDAO {

	public void createInstance(Transaction txn, Instance instance){
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		Entity entityinstance = new Entity(MyPocketConstance.instanceKind , instance.getId());//(kind,id)		
		
		entityinstance.setProperty("name", instance.getName());
		entityinstance.setProperty("createdBy", instance.getcreatedBy());	
		
		datastore.put(txn, entityinstance);
	}
}
