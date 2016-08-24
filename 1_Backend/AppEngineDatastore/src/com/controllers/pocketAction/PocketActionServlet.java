package com.controllers.pocketAction;

import java.io.BufferedReader;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.tools.ant.taskdefs.Sync.MyCopy;

import com.DAO.pocket.InstaceDAO;
import com.DAO.pocket.UserDAO;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.labs.repackaged.org.json.JSONException;
import com.google.appengine.labs.repackaged.org.json.JSONObject;
import com.models.pocket.Instance;
import com.models.pocket.User;
import com.util.pocket.AbstractMyPocketServletAction;

@SuppressWarnings("serial")
public class PocketActionServlet extends AbstractMyPocketServletAction{
	
	private static final Logger log = Logger.getLogger(PocketActionServlet.class.getName());
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		// TODO Auto-generated method stub
		//super.doPost(req, resp);
		String reqType = req.getRequestURI();
		log.info("============DoPost URL : "+reqType);
		
		switch (reqType) {
		case "/web/createInstance":createInstance(req, resp);			
			break;
		case "/web/expense": createExpense(req, resp);	
			break;
		default:
			break;
		}
		
		
	}
	
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		/*resp.setContentType("text/plain");
		resp.getWriter().println("Hello, worldGhost");*/
		
		String reqUrl = req.getRequestURI();
		log.info("Requested Url : "+reqUrl);
		
		/*storeData();
		storeChildData();
		getData();*/
		
		log.info("================================+++++> doGet()");
		
		JSONObject resObj = new JSONObject();
		
		try {
			resObj.put("Data", "Hi ghost");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		resp.setStatus(HttpServletResponse.SC_OK);
		resp.getWriter().println(resObj);

	}
	
	public void storeData(){
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		Entity employee = new Entity("employee","Salieri");//(kind,id)		
		//Entity employee = new Entity("employee");//(kind)
		employee.setProperty("firstName", "Antonio");
		employee.setProperty("lastName", "Salieri");
		employee.setProperty("hireDate", new Date());
		employee.setProperty("attendedHrTraining", false);
		
		datastore.put(employee);
	}
	
	public void storeChildData(){
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		Key empolyee = new Entity("employee","Salieri").getKey();
		
		Entity address = new Entity("address", "Salieri" ,empolyee);
		address.setProperty("no", "61");
		address.setProperty("town", "Kandy");
		address.setProperty("provonce", "central");
		
		datastore.put(address);		
	}
	
	public void getData(){
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		Entity employee = new Entity("employee","Salieri");
		Key keyEmployee = employee.getKey();
		Key addressKey = new Entity("address", "Salieri" ,keyEmployee).getKey();
		Entity e;
		try {
			e = datastore.get(addressKey);
			log.info("========================> provonce: "+e.getProperty("provonce"));
		} catch (EntityNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		//Key employeeKey = employee.getKey();
		
	}
	
	public void createInstance(HttpServletRequest request, HttpServletResponse response) throws IOException{
		BufferedReader reqPayLoad = request.getReader();
		String reqData = "";
		
		if(reqPayLoad != null){
			reqData = reqPayLoad.readLine();
		}
		
		try {
			JSONObject jsonObject = new JSONObject(reqData);
			
			if(jsonObject.has("name") && jsonObject.has("createdBy") && jsonObject.has("password")){
				response.setStatus(HttpServletResponse.SC_CREATED);
				
				//Generate id
				String idStr = Long.toString(System.nanoTime());
				String iname = jsonObject.getString("name");
				String createdBy = jsonObject.getString("createdBy");
				String password = jsonObject.getString("password");
				
				Date date = new Date();
				SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyyy h:mm:ss a");
				String formattedDate = sdf.format(date);
				System.out.println(formattedDate); // 12/01/2011 4:48:16 PM
				
				//Setting instance
				Instance instance = new Instance();
				instance.setId(idStr);
				instance.setName(iname);
				instance.setcreatedBy(createdBy);
				instance.setCreatedDate(date.toString());
				
				//Setting User
				User user = new User();
				user.setUserEmail(createdBy);
				user.setInstanceId(instance.getId());
				user.setUserPassword(password);
				
				InstanceService instanceService = new InstanceService();
				instanceService.createInstance(instance, user);			
				
				jsonObject.put("instanceId", idStr);
				response.getWriter().println(jsonObject);
			}else{
				sendErrorMessage(request, response, 400);				
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	public void createExpense(HttpServletRequest request, HttpServletResponse response) throws IOException{
		BufferedReader reqPayLoad = request.getReader();
		String reqData = "";
		
		if(reqPayLoad != null){
			reqData = reqPayLoad.readLine();
		}
		
		try {
			JSONObject jsonObject = new JSONObject(reqData);
			
			if(jsonObject.has("user") && jsonObject.has("expenseName")){
				response.setStatus(HttpServletResponse.SC_CREATED);
				
				//Geerate id
				String idStr = Long.toString(System.nanoTime());
				jsonObject.put("expid", idStr);
				
				response.getWriter().println(jsonObject);
			}else{
				sendErrorMessage(request, response, 400);				
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
