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
                    'name' => 'nullable',
                    'description' => 'nullable',
                    'type' => 'nullable',
                    'start_date' => 'nullable',
                    'end_date' => 'nullable',
                ]);

                $event = Event::where('id',$id)->first();
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
                $event = Event::where('id',$id)->first();
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

        // Search Event
        public function searchEvents(Request $request){
            try {

                $events = Event::where('name','like','%'.$request->name.'%')->get();
                if($events){
                    return response()->json([
                        'status' => true,
                        'response_code' => 200,
                        'message' => 'Event searched successfully',
                        'events' => $events
                    ], 200);
                }else{
                    return response()->json([
                        'status' => true,
                        'response_code' => 200,
                        'message' => 'No event not found'
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

        public function filterEvents(Request $request){
            try {
                $request->validate([
                    'key' => 'required|in:type,start_date,end_date',
                    'value' => 'required'
                ]);

                $key = $request->key;
                $value = $request->value;

                $events = Event::where($key, 'like', '%' . $value . '%')->get();

                return response()->json([
                    'status' => true,
                    'events' => $events,
                    'message' => 'Filtered successfully',
                ], 200);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => $e->getMessage(),
                    'line' => $e->getLine()
                ], 400);
            }
        }


        public function getEventTypes(){
            try {
                $types = \App\Models\Event::select('type')->distinct()->pluck('type');
                return response()->json([
                    'status' => true,
                    'types' => $types,
                ]);
            } catch (\Exception $e) {
                return response()->json([
                    'status' => false,
                    'message' => 'Error fetching event types: ' . $e->getMessage(),
                ], 500);
            }
        }

        public function searchByType(Request $request){
            $request->validate([
                'type' => 'required|string'
            ]);

            $events = Event::where('type', $request->type)->get();

            return response()->json([
                'status' => true,
                'events' => $events
            ]);
        }

        public function searchByDate(Request $request)
        {
            $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ]);

            $events = Event::whereDate('start_date', '>=', $request->start_date)
                            ->whereDate('end_date', '<=', $request->end_date)
                            ->get();

            return response()->json([
                'status' => true,
                'events' => $events
            ]);
        }

}
