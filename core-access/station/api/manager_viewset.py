from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from station.models import Pump, Sale, StationFuelBalance


class PumpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pump
        fields = ['id', 'code', 'station', 'fuel_type']


class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = [
            'id', 'seller', 'invoice_name', 'invoice_nit', 'customer_email', 'amount',
            'current_product_price', 'product_quantity', 'product_type', 'pump_used', 'date_time'
        ]
        read_only_fields = ['date_time']


class StationFuelBalanceSerializer(serializers.ModelSerializer):
    fuel_type_name = serializers.CharField(
        source='fuel_type.name', read_only=True)
    station_name = serializers.CharField(source='station.name', read_only=True)

    class Meta:
        model = StationFuelBalance
        fields = ['station', 'fuel_type', 'balance',
                  'fuel_type_name', 'station_name']


class StationManagerViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def pumps(self, request):
        pumps = Pump.objects.all()
        serializer = PumpSerializer(pumps, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_pump(self, request):
        serializer = PumpSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def sales(self, request):
        station_id = request.query_params.get('station_id')
        if not station_id:
            return Response({"detail": "station_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        sales = Sale.objects.filter(
            pump_used__station__id=station_id).order_by('-date_time')
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel_sale(self, request, pk=None):
        try:
            sale = Sale.objects.get(pk=pk)
            sale.status = 'cancelled'
            sale.save()
            return Response({"detail": "Sale cancelled successfully."}, status=status.HTTP_200_OK)
        except Sale.DoesNotExist:
            return Response({"detail": "Sale not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def fuel_balance(self, request):
        station_id = request.query_params.get('station_id')
        if not station_id:
            return Response({"detail": "station_id query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        balances = StationFuelBalance.objects.filter(station__id=station_id)
        serializer = StationFuelBalanceSerializer(balances, many=True)
        return Response(serializer.data)
