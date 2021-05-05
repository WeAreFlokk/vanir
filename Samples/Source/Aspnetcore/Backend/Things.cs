using System;
using System.Threading.Tasks;
using Dolittle.SDK.Aggregates;
using Dolittle.SDK.Concepts;
using Dolittle.SDK.Events;
using Dolittle.SDK.Events.Handling;
using Dolittle.SDK.Events.Store;
using Dolittle.Vanir.Backend.GraphQL;
using FluentValidation;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;

namespace Backend
{
    public class SomeConcept : ConceptAs<string>
    {
    }

    public class NestedObject
    {
        public SomeConcept DeepConcept { get; set; }
    }

    public class SomeConceptValidator : AbstractValidator<SomeConcept>
    {
        public SomeConceptValidator()
        {
            RuleFor(_ => _.Value).NotNull().NotEmpty().WithMessage("The string must have content");
        }
    }

    public class MyObject
    {
        public string Something { get; set; }
        public int SomeNumber { get; set; }
        public SomeConcept Concept { get; set; }
        public NestedObject Nested { get; set; }
    }

    public class MyObjectValidator : AbstractValidator<MyObject>
    {
        public MyObjectValidator()
        {
            RuleFor(_ => _.Something).NotNull().NotEmpty().WithMessage("This should be set");
        }
    }

    public class MySecondObjectValidator : AbstractValidator<MyObject>
    {
        public MySecondObjectValidator()
        {
            RuleFor(_ => _.SomeNumber).GreaterThan(42).WithMessage("Must be greater than 42");
            RuleFor(_ => _.Concept).SetValidator(new SomeConceptValidator());
        }
    }

    [AggregateRoot("01ad9a9f-711f-47a8-8549-43320f782a1e")]
    public class Kitchen : AggregateRoot
    {
        int _counter;

        public Kitchen(EventSourceId eventSource)
            : base(eventSource)
        {
        }

        public void PrepareDish(string dish, string chef)
        {
            if (_counter >= 2) throw new Exception("Cannot prepare more than 2 dishes");
            Apply(new DishPrepared(dish, chef));
            ApplyPublic(new DishPrepared(dish, chef));
            Console.WriteLine($"Kitchen Aggregate {EventSourceId} has applied {_counter} {typeof(DishPrepared)} events");
        }

        void On(DishPrepared @event) => _counter++;
    }

    [EventType("2977fd82-9614-4082-ab8e-d436ed129248")]
    public class DishPrepared
    {
        public DishPrepared(string dish, string chef)
        {
            Dish = dish;
            Chef = chef;
        }
        public string Dish { get; }
        public string Chef { get; }
    }

    [EventHandler("db2bb639-937c-49ca-946e-ad3868882080")]
    public class MyEventHandler
    {
        readonly ILogger<MyEventHandler> _logger;

        public MyEventHandler(ILogger<MyEventHandler> logger)
        {
            _logger = logger;
        }

        public async Task Handle(DishPrepared @event, EventContext context)
        {
            _logger.LogInformation($"{@event.Chef} has prepared {@event.Dish}. Yummm!");
            await Task.CompletedTask;
        }
    }


    public class Things : GraphController
    {
        readonly IMongoDatabase _mongoDatabase;
        readonly IEventStore _eventStore;
        readonly IAggregateOf<Kitchen> _kitchen;

        public Things(IMongoDatabase mongoDatabase, IEventStore eventStore, IAggregateOf<Kitchen> kitchen)
        {
            _mongoDatabase = mongoDatabase;
            _eventStore = eventStore;
            _kitchen = kitchen;
        }

        [Mutation]
        public async Task<bool> DoMore()
        {
            //_eventStore.CommitEvent(new DishPrepared("Bean Blaster Taco", "Mr. Taco"), Guid.NewGuid());
            await _kitchen
                .Get(Guid.NewGuid())
                .Perform(_ => _.PrepareDish("Bean Blaster Taco", "Mr. Taco"));
            return true;
        }

        [Mutation]
        public bool DoSomething(OwnerId input)
        {
            Console.WriteLine($"Hello world - {input}");
            return true;
        }

        [Mutation]
        public bool DoThings(MyObject input)
        {
            Console.WriteLine($"Hello world - {input.Something}");
            return true;
        }

        [Query("MyCustomName")]
        public Owner TheOwner(int id) => new Owner
        {
            Id = Guid.NewGuid(),
            Name = "Blah"
        };

        [Query]
        public Owner Something()
        {
            return new Owner();
        }
    }
}

