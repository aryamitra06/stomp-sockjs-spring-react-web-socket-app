package com.websocketapi.WS;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;

@Controller
@CrossOrigin(origins = "*")
public class WsController {
    ArrayList<String> orders = new ArrayList<String>();

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @MessageMapping("/order")
    @SendTo("/topic/orders")
    public ArrayList<String> handleMessage(@Payload String order){
        System.out.println("Added new order =>" + order);
        orders.add(order);
        System.out.println("All orders =>" + orders);
        return orders;
    }
}
