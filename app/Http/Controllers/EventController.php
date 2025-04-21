<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Http\Controllers\Controller;

class EventController extends Controller
{
        // Read All Events
        public function getEvents(){
            try {
                $events = Event::all();

                return response()->json([
                    'status' => true,
                    'response_code' => 200,
                    'message' => 'Events fetched successfully',
                    'data' => $events
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response_code' => 400,
                    'message' => $e->getMessage(),
                    'line_number' => $e->getLine()
                ], 400);
            }
        }

        // Create Event
        public function createEvent(Request $request){
            try {
                $request->validate([
                    'name' => 'required',
                    'description' => 'required',
                    'type' => 'required',
                    'start_date' => 'required',
                    'end_date' => 'required',
                ]);

                $event = Event::create($request->only(['name', 'description', 'type','start_date', 'end_date']));

                return response()->json([
                    'status' => true,
                    'response_code' => 200,
                    'message' => 'Event created successfully',
                    'data' => $event
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response_code' => 400,
                    'message' => $e->getMessage(),
                    'line_number' => $e->getLine()
                ], 400);
            }
        }

        // Update Event
        public function updateEvent(Request $request, $id){
            try {
                $request->validate([
                    'name' => 'required',
                    'description' => 'required',
                    'type' => 'required',
                    'start_date' => 'required',
                    'end_date' => 'required',
                ]);

                $event = Event::findOrFail($id);
                if($event){
                    $event->update($request->only(['name', 'description', 'type','start_date', 'end_date']));
                    return response()->json([
                        'status' => true,
                        'response_code' => 200,
                        'message' => 'Event updated successfully',
                        'data' => $event
                    ], 200);
                }else{
                    return response()->json([
                        'status' => true,
                        'response_code' => 200,
                        'message' => 'Event not found',
                        'data' => $event
                    ], 200);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response_code' => 400,
                    'message' => $e->getMessage(),
                    'line_number' => $e->getLine()
                ], 400);
            }
        }

        // Delete Event
        public function deleteEvent($id){
            try {
                $event = Event::findOrFail($id);
                if($event){
                    $event->delete();
                    return response()->json([
                        'status' => true,
                        'response_code' => 200,
                        'message' => 'Event deleted successfully'
                    ], 200);
                }else{
                    return response()->json([
                        'status' => true,
                        'response_code' => 200,
                        'message' => 'Event not found'
                    ], 200);
                }

            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'response_code' => 400,
                    'message' => $e->getMessage(),
                    'line_number' => $e->getLine()
                ], 400);
            }
        }

}
